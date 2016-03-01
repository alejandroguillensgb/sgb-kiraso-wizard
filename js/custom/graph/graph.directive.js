(function() {
    'use strict';

    angular
        .module('custom.graph')
        .directive('graph', graph);

    graph.$inject = ['d3Factory', '$rootScope', '$http', 'kirasoFactory'];
    function graph (d3Factory, $rootScope, $http, kirasoFactory) {

        var directive = {
            restrict: 'EA',
            link: function(scope, element, attrs) {
              d3Factory.d3().then(function(d3) {
                console.log("directive");
                // TODO add user settings
                var consts = {
                  defaultTitle: "random variable"
                };
                var settings = {
                  appendElSpec: "#graph"
                };
                // define graphcreator object
                var GraphCreator = function(svg, nodes, edges){
                  var thisGraph = this;
                  thisGraph.idct = 0;

                  thisGraph.nodes = nodes || [];
                  thisGraph.edges = edges || [];

                  thisGraph.state = {
                    selectedNode: null,
                    selectedEdge: null,
                    mouseDownNode: null,
                    mouseDownLink: null,
                    justDragged: false,
                    justScaleTransGraph: false,
                    lastKeyDown: -1,
                    shiftNodeDrag: false,
                    selectedText: null,
                    doubleClick: false
                  };

                  // define arrow markers for graph links
                  var defs = svg.append('svg:defs');
                  defs.append('svg:marker')
                    .attr('id', 'end-arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', "32")
                    .attr('markerWidth', 3.5)
                    .attr('markerHeight', 3.5)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M0,-5L10,0L0,5');

                  // define arrow markers for leading arrow
                  defs.append('svg:marker')
                    .attr('id', 'mark-end-arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 7)
                    .attr('markerWidth', 3.5)
                    .attr('markerHeight', 3.5)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M0,-5L10,0L0,5');
                  
                  thisGraph.svg = svg;
                  thisGraph.svgG = svg.append("g")
                    .classed(thisGraph.consts.graphClass, true);
                  var svgG = thisGraph.svgG;
                  
                  // displayed when dragging between nodes
                  thisGraph.dragLine = svgG.append('svg:path')
                    .attr('class', 'link dragline hidden')
                    .attr('d', 'M0,0L0,0')
                    .style('marker-end', 'url(#mark-end-arrow)');
                  
                  // svg nodes and edges
                  thisGraph.paths = svgG.append("g").selectAll("g");
                  thisGraph.circles = svgG.append("g").selectAll("g");

                  thisGraph.drag = d3.behavior.drag()
                    .origin(function(d){
                      return {x: d.x, y: d.y};
                    })
                    .on("drag", function(args){
                      thisGraph.state.justDragged = true;
                      thisGraph.dragmove.call(thisGraph, args);
                    })
                    .on("dragend", function() {
                      // todo check if edge-mode is selected
                    });
                  
                  // listen for key events
                  d3.select(window).on("keydown", function(){
                    thisGraph.svgKeyDown.call(thisGraph);
                  })
                  .on("keyup", function(){
                    thisGraph.svgKeyUp.call(thisGraph);
                  });
                  svg.on("mousedown", function(d){thisGraph.svgMouseDown.call(thisGraph, d);});
                  svg.on("mouseup", function(d){thisGraph.svgMouseUp.call(thisGraph, d);});
                  
                  scope.createNodeFunction = function(event, item) {
                    console.log("listen create-node");
                    thisGraph.svgMouseDD.call(thisGraph, item);
                  };

                  scope.$on("create-node", scope.createNodeFunction);
                  
                  scope.createFileFunction = function(){
                    console.log("listen create-file");
                    var saveEdges = [];
                    thisGraph.edges.forEach(function(val, i){
                    saveEdges.push({source: val.source.id, target: val.target.id, eventModel: val.eventModel});
                    });
                    var item = window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges});
                    scope.$emit("send-info", item);
                  };

                  scope.$on("create-file", scope.createFileFunction);

                  

                  // listen for dragging
                  var dragSvg = d3.behavior.zoom()
                    .on("zoom", function(){
                      if (d3.event.sourceEvent.ctrlKey){
                      // TODO  the internal d3 state is still changing
                      return false;
                      } else{
                        thisGraph.zoomed.call(thisGraph);
                      }
                      return true;
                    })
                    .on("zoomstart", function(){
                      var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
                      if (ael){
                        ael.blur();
                      }
                      if (!d3.event.sourceEvent.ctrlKey) d3.select('body').style("cursor", "move");
                    })
                    .on("zoomend", function(){
                      d3.select('body').style("cursor", "auto");
                    });

                  svg.call(dragSvg).on("dblclick.zoom", null);
                  
                  // listen for resize
                  window.onresize = function(){thisGraph.updateWindow(svg);};
                  
                  // handle download data
                  d3.select("#download-input").on("click", function(){
                    var saveEdges = [];
                    thisGraph.edges.forEach(function(val, i){
                      saveEdges.push({source: val.source.id, target: val.target.id});
                    });
                    var blob = new Blob([window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "mydag.json");
                  });

                  window.addEventListener("download-file", function(event) {
                    console.log("files")
                    var saveEdges = [];
                    thisGraph.edges.forEach(function(val, i){
                      saveEdges.push({source: val.source.id, target: val.target.id});
                    });
                    var blob = new Blob([window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "mydag.json");
                  }, false);

                  scope.$on('save-graph', function(){
                    console.log("save listener");
                    var saveEdges = [];                    
                    thisGraph.edges.forEach(function(val, i){
                      saveEdges.push({source: val.source.id, target: val.target.id, eventModel: val.eventModel});
                    });
                    var reqObj = {
                      graph: JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})
                    };
                    $http
                      .post("http://localhost:8000/mongoose_setGraph?app=" + scope.app_name, reqObj)
                      .success(function(){
                        console.log("graph app saved");
                        alert("Your app was saved");
                      })
                      .error(function(){
                        console.log("error saving graph app");
                        alert("Error saving your app")
                      });
                  });

                  scope.$on("set-graph", function(){
                    console.log("setting graph");
                    var saveEdges = [];                    
                    thisGraph.edges.forEach(function(val, i){
                      saveEdges.push({source: val.source.id, target: val.target.id, eventModel: val.eventModel});
                    });
                    kirasoFactory.setGraph(JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges}));
                  });

                  scope.$on("push-paramsModel", function(event, nodeId, model){
                    var node = _.find(thisGraph.nodes, {id: nodeId});
                    var index = _.indexOf(thisGraph.nodes, node);
                    thisGraph.nodes.splice(index, 1, {  id: nodeId,
                                                        title: node.title,
                                                        type: node.type,
                                                        x: node.x, y: node.y,
                                                        path: node.path,
                                                        screenModel: node.screenModel,
                                                        paramsModel: model,
                                                        dataModel: node.dataModel
                                                      });
                  });

                  scope.$on("push-screenModel", function(event, nodeId, model){
                    var node = _.find(thisGraph.nodes, {id: nodeId});
                    var index = _.indexOf(thisGraph.nodes, node);
                    thisGraph.nodes.splice(index, 1, {  id: nodeId,
                                                        title: node.title,
                                                        type: node.type,
                                                        x: node.x, y: node.y,
                                                        path: node.path,
                                                        screenModel: model,
                                                        paramsModel: node.paramsModel,
                                                        dataModel: node.dataModel
                                                      });
                  });

                  scope.$on("push-dataModel", function(event, nodeId, model){
                    var node = _.find(thisGraph.nodes, {id: nodeId});
                    var index = _.indexOf(thisGraph.nodes, node);
                    thisGraph.nodes.splice(index, 1, {  id: nodeId,
                                                        title: node.title,
                                                        type: node.type,
                                                        x: node.x, y: node.y,
                                                        path: node.path,
                                                        screenModel: node.screenModel,
                                                        paramsModel: node.paramsModel,
                                                        dataModel: model
                                                      });
                  });

                  scope.$on("push-eventModel", function(event, srcId, tgtId, model){
                    var edge = _.find(thisGraph.edges, function(elem){
                      return elem.source.id == srcId && elem.target.id == tgtId; 
                    });
                    var index = _.indexOf(thisGraph.edges, edge);
                    thisGraph.edges.splice(index, 1, {  source: edge.source,
                                                        target: edge.target,
                                                        eventModel: model
                                                      });
                    thisGraph.updateGraph();
                  });

                  d3.select("#hidden-file-upload").on("change", function(){
                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                      var uploadFile = this.files[0];
                      var filereader = new window.FileReader();
                      filereader.onload = function(){
                        var txtRes = filereader.result;
                        // TODO better error handling
                        try{
                          var jsonObj = JSON.parse(txtRes);
                          thisGraph.deleteGraph(true);
                          thisGraph.nodes = jsonObj.nodes;
                          thisGraph.setIdCt(jsonObj.nodes.length + 1);
                          var newEdges = jsonObj.edges;
                          newEdges.forEach(function(e, i){
                            newEdges[i] = {source: thisGraph.nodes.filter(function(n){return n.id == e.source;})[0],
                            target: thisGraph.nodes.filter(function(n){return n.id == e.target;})[0]};
                          });
                          thisGraph.edges = newEdges;
                          thisGraph.updateGraph();
                        }catch(err){
                          window.alert("Error parsing uploaded file\\nerror message: " + err.message);
                          return;
                        }
                      };
                      filereader.readAsText(uploadFile);
                    } else {
                      alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
                    }
                  });
                  
                  // handle delete graph
                  d3.select("#delete-graph").on("click", function(){
                    thisGraph.deleteGraph(false);
                  });
                };

                GraphCreator.prototype.setIdCt = function(idct){
                  this.idct = idct;
                };

                GraphCreator.prototype.consts =  {
                  selectedClass: "selected",
                  connectClass: "connect-node",
                  circleGClass: "conceptG",
                  graphClass: "graph",
                  activeEditId: "active-editing",
                  DELETE_KEY: 46,
                  ENTER_KEY: 13,
                  nodeRadius: 50
                };

                /* PROTOTYPE FUNCTIONS */
                GraphCreator.prototype.dragmove = function(d) {
                  var thisGraph = this;
                  if (thisGraph.state.shiftNodeDrag){
                    thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
                  } else{
                    d.x += d3.event.dx;
                    d.y +=  d3.event.dy;
                    thisGraph.updateGraph();
                  }
                };

                GraphCreator.prototype.deleteGraph = function(skipPrompt){
                  var thisGraph = this,
                  doDelete = true;
                  if (!skipPrompt){
                    doDelete = window.confirm("Press OK to delete this graph");
                  }
                  if(doDelete){
                    thisGraph.nodes = [];
                    thisGraph.edges = [];
                    thisGraph.updateGraph();
                  }
                };

                /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
                GraphCreator.prototype.selectElementContents = function(el) {
                  var range = document.createRange();
                  range.selectNodeContents(el);
                  var sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(range);
                };

                /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
                GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
                  var words = title.split(/\\s+/g),
                  nwords = words.length;
                  var el = gEl.append("text")
                    .attr("text-anchor","middle")
                    .attr("dy", "-" + (nwords-1)*7.5);
                  for (var i = 0; i < words.length; i++) {
                    var tspan = el.append('tspan').text(words[i]);
                    if (i > 0)
                      tspan.attr('x', 0).attr('dy', '15');
                  }
                };

                // remove edges associated with a node
                GraphCreator.prototype.spliceLinksForNode = function(node) {
                  var thisGraph = this,
                  toSplice = thisGraph.edges.filter(function(l) {
                    return (l.source === node || l.target === node);
                  });
                  toSplice.map(function(l) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
                  });
                };

                GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData){
                  var thisGraph = this;
                  d3Path.classed(thisGraph.consts.selectedClass, true);
                  if (thisGraph.state.selectedEdge){
                    thisGraph.removeSelectFromEdge();
                  }
                  thisGraph.state.selectedEdge = edgeData;
                };

                GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData){
                  var thisGraph = this;
                  d3Node.classed(this.consts.selectedClass, true);
                  if (thisGraph.state.selectedNode){
                    thisGraph.removeSelectFromNode();
                  }
                  thisGraph.state.selectedNode = nodeData;
                };

                GraphCreator.prototype.removeSelectFromNode = function(){
                  var thisGraph = this;
                  thisGraph.circles.filter(function(cd){
                    return cd.id === thisGraph.state.selectedNode.id;
                  }).classed(thisGraph.consts.selectedClass, false);
                  thisGraph.state.selectedNode = null;
                };

                GraphCreator.prototype.removeSelectFromEdge = function(){
                  var thisGraph = this;
                  thisGraph.paths.filter(function(cd){
                    return cd === thisGraph.state.selectedEdge;
                  }).classed(thisGraph.consts.selectedClass, false);
                  thisGraph.state.selectedEdge = null;
                };

                GraphCreator.prototype.pathMouseDown = function(d3path, d){
                  $rootScope.$broadcast("select-edge", d3path[0][0].__data__);
                  var thisGraph = this,
                  state = thisGraph.state;
                  d3.event.stopPropagation();
                  state.mouseDownLink = d;
                  if (state.selectedNode){
                    thisGraph.removeSelectFromNode();
                  }
                  var prevEdge = state.selectedEdge;
                  if (!prevEdge || prevEdge !== d){
                    thisGraph.replaceSelectEdge(d3path, d);
                  } else{
                    thisGraph.removeSelectFromEdge();
                  }
                };

                // mousedown on node
                GraphCreator.prototype.circleMouseDown = function(d3node, d){
                  var thisGraph = this,
                  state = thisGraph.state;
                  d3.event.stopPropagation();
                  state.mouseDownNode = d;
                  $rootScope.$broadcast("select-node", d3node[0][0].__data__);
                  // var event = document.createEvent('CustomEvent');
                  // event.initCustomEvent("select-node", true, true, d3node[0][0].__data__);
                  // document.documentElement.dispatchEvent(event);
                  if (d3.event.ctrlKey){
                    state.shiftNodeDrag = d3.event.ctrlKey;
                    // reposition dragged directed edge
                    thisGraph.dragLine.classed('hidden', false)
                      .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
                    return;
                  }
                };

                /* place editable text on node in place of svg text */
                GraphCreator.prototype.changeTextOfNode = function(d3node, d){
                  var thisGraph= this,
                  consts = thisGraph.consts,
                  htmlEl = d3node.node();
                  d3node.selectAll("text").remove();
                  var nodeBCR = htmlEl.getBoundingClientRect(),
                  curScale = nodeBCR.width/consts.nodeRadius,
                  placePad  =  5*curScale,
                  useHW = curScale > 1 ? nodeBCR.width*0.71 : consts.nodeRadius*1.42;
                  // replace with editableconent text
                  var d3txt = thisGraph.svg.selectAll("foreignObject")
                    .data([d])
                    .enter()
                    .append("foreignObject")
                    .attr("x", nodeBCR.left + placePad )
                    .attr("y", nodeBCR.top + placePad)
                    .attr("height", 2*useHW)
                    .attr("width", useHW)
                    .append("xhtml:p")
                    .attr("id", consts.activeEditId)
                    .attr("contentEditable", "true")
                    .text(d.title)
                    .on("mousedown", function(d){
                      d3.event.stopPropagation();
                    })
                    .on("keydown", function(d){
                      d3.event.stopPropagation();
                      if (d3.event.keyCode == consts.ENTER_KEY && !d3.event.ctrlKey){
                        this.blur();
                      }
                    })
                    .on("blur", function(d){
                      d.title = this.textContent;
                      thisGraph.insertTitleLinebreaks(d3node, d.title);
                      d3.select(this.parentElement).remove();
                    });
                  return d3txt;
                };

                // mouseup on nodes
                GraphCreator.prototype.circleMouseUp = function(d3node, d){
                  var thisGraph = this,
                  state = thisGraph.state,
                  consts = thisGraph.consts;
                  // reset the states
                  state.shiftNodeDrag = false;
                  d3node.classed(consts.connectClass, false);
                  var mouseDownNode = state.mouseDownNode;
                  if (!mouseDownNode) return;
                  thisGraph.dragLine.classed("hidden", true);
                  if (mouseDownNode !== d){
                    // we're in a different node: create new edge for mousedown edge and add to graph
                    var newEdge = {source: mouseDownNode, target: d};
                    var filtRes = thisGraph.paths.filter(function(d){
                    if (d.source === newEdge.target && d.target === newEdge.source){
                      thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
                    }
                    return d.source === newEdge.source && d.target === newEdge.target;
                    });
                    if (!filtRes[0].length){
                      thisGraph.edges.push(newEdge);
                      thisGraph.updateGraph();
                    }
                  } else{
                    // we're in the same node
                    if (state.justDragged) {
                      // dragged, not clicked
                      state.justDragged = false;
                    } else{
                      // clicked, not dragged
                      if (d3.event.ctrlKey){
                        // shift-clicked node: edit text content
                        var d3txt = thisGraph.changeTextOfNode(d3node, d);
                        var txtNode = d3txt.node();
                        thisGraph.selectElementContents(txtNode);
                        txtNode.focus();
                      } else{
                        if (state.selectedEdge){
                          thisGraph.removeSelectFromEdge();
                        }
                        var prevNode = state.selectedNode;
                        if (!prevNode || prevNode.id !== d.id){
                          thisGraph.replaceSelectNode(d3node, d);
                        } else{
                          thisGraph.removeSelectFromNode();
                        }
                      }
                    }
                  }
                  state.mouseDownNode = null;
                  return;
                }; // end of circles mouseup

                GraphCreator.prototype.svgMouseDD = function(item){
                  var thisGraph = this,
                  state = thisGraph.state;
                  this.state.doubleClick = true;
                  var d = { id: thisGraph.idct++, 
                            title: item.name, 
                            type: item.type, 
                            x: 150, y: 150, 
                            path: item.path,
                            screenModel: {},
                            paramsModel: {},
                            dataModel: {}};
                  thisGraph.nodes.push(d);
                  thisGraph.updateGraph();
                };

                GraphCreator.prototype.svgMouseD = function(){
                  var thisGraph = this,
                  state = thisGraph.state;
                  this.state.doubleClick = true;
                  var xycoords = d3.mouse(thisGraph.svgG.node()),
                  d = {id: thisGraph.idct++, title: consts.defaultTitle, x: xycoords[0], y: xycoords[1]};
                  thisGraph.nodes.push(d);
                  thisGraph.updateGraph();
                  // make title of text immediently editable
                  var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
                    return dval.id === d.id;
                  }), d),
                  txtNode = d3txt.node();
                  thisGraph.selectElementContents(txtNode);
                  txtNode.focus();
                };

                // mousedown on main svg
                GraphCreator.prototype.svgMouseDown = function(){
                  this.state.graphMouseDown = true;
                };

                // mouseup on main svg
                GraphCreator.prototype.svgMouseUp = function(){
                  var thisGraph = this,
                  state = thisGraph.state;
                  if (state.justScaleTransGraph) {
                    // dragged not clicked
                    state.justScaleTransGraph = false;
                  } else if (state.graphMouseDown && d3.event.ctrlKey){
                    // clicked not dragged from svg
                    var xycoords = d3.mouse(thisGraph.svgG.node()),
                    d = {id: thisGraph.idct++, title: consts.defaultTitle, x: xycoords[0], y: xycoords[1]};
                    thisGraph.nodes.push(d);
                    thisGraph.updateGraph();
                    // make title of text immediently editable
                    var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
                      return dval.id === d.id;
                    }), d),
                    txtNode = d3txt.node();
                    thisGraph.selectElementContents(txtNode);
                    txtNode.focus();
                  } else if (state.shiftNodeDrag){
                    // dragged from node
                    state.shiftNodeDrag = false;
                    thisGraph.dragLine.classed("hidden", true);
                  }
                  state.graphMouseDown = false;
                };

                // keydown on main svg
                GraphCreator.prototype.svgKeyDown = function() {
                  var thisGraph = this,
                  state = thisGraph.state,
                  consts = thisGraph.consts;
                  // make sure repeated key presses don't register for each keydown
                  if(state.lastKeyDown !== -1) return;
                  state.lastKeyDown = d3.event.keyCode;
                  var selectedNode = state.selectedNode,
                  selectedEdge = state.selectedEdge;
                  switch(d3.event.keyCode) {
                    case consts.DELETE_KEY:
                      d3.event.preventDefault();
                      if (selectedNode){
                        $rootScope.$broadcast("delete-node");
                        thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
                        thisGraph.spliceLinksForNode(selectedNode);
                        state.selectedNode = null;
                        thisGraph.updateGraph();
                      } else if (selectedEdge){
                        $rootScope.$broadcast("delete-edge");
                        thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
                        state.selectedEdge = null;
                        thisGraph.updateGraph();
                      }
                      break;
                  }
                };

                GraphCreator.prototype.svgKeyUp = function() {
                  this.state.lastKeyDown = -1;
                };

                // call to propagate changes to graph
                GraphCreator.prototype.updateGraph = function(){
                  var thisGraph = this,
                  consts = thisGraph.consts,
                  state = thisGraph.state;

                  thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d){
                    return String(d.source.id) + "+" + String(d.target.id);
                  });
                  var paths = thisGraph.paths;
                  
                  // update existing paths
                  paths.style('marker-end', 'url(#end-arrow)')
                    .classed(consts.selectedClass, function(d){
                      return d === state.selectedEdge;
                    })
                    .attr("d", function(d){
                      return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                    });

                  // add new paths
                  paths.enter()
                    .append("path")
                    .style('marker-end','url(#end-arrow)')
                    .classed("link", true)
                    .attr("d", function(d){
                      return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                    })
                    .on("mousedown", function(d){
                    thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
                    })
                    .on("mouseup", function(d){
                      state.mouseDownLink = null;
                    });

                  // remove old links
                  paths.exit().remove();

                  // update existing nodes
                  thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d){ return d.id;});
                  thisGraph.circles.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";});

                  // add new nodes
                  var newGs= thisGraph.circles.enter()
                    .append("g");

                  newGs.classed(consts.circleGClass, true)
                    .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
                    .on("mouseover", function(d){
                      if (state.shiftNodeDrag){
                        d3.select(this).classed(consts.connectClass, true);
                      }
                    })
                    .on("mouseout", function(d){
                      d3.select(this).classed(consts.connectClass, false);
                    })
                    .on("mousedown", function(d){
                      thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
                    })
                    .on("mouseup", function(d){
                      thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
                    })
                    .call(thisGraph.drag);

                  newGs.append("circle")
                    .attr("r", String(consts.nodeRadius));

                  newGs.each(function(d){
                    thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
                  });

                  // remove old nodes
                  thisGraph.circles.exit().remove();
                };

                GraphCreator.prototype.zoomed = function(){
                  this.state.justScaleTransGraph = true;
                  d3.select("." + this.consts.graphClass)
                    .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
                };

                GraphCreator.prototype.updateWindow = function(svg){
                  var docEl = document.documentElement,
                  bodyEl = document.getElementById('graph');
                  var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
                  var y = 400;//window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
                  svg.attr("width", x).attr("height", y);
                };

                /**** MAIN ****/
                // warn the user when leaving
                // window.onbeforeunload = function(){
                // return "Make sure to save your graph locally before leaving :-)";
                // };
                scope.newGraphFunction = function(){
                  var docEl = document.documentElement,
                  bodyEl = document.getElementById('graph'),
                  svgEl= document.getElementsByTagName('svg');
                  var index;
                  for (index = svgEl.length - 1; index >= 0; index--) {
                    svgEl[index].parentNode.removeChild(svgEl[index]);
                  };
                  var width = window.innerWidth || bodyEl.clientWidth || docEl.clientWidth,
                  height = 400;//bodyEl.clientHeight || window.innerHeight|| docEl.clientHeight;
                  var xLoc = width/2 - 25,
                  yLoc = 100;
                  // initial node data
                  var nodes = [];
                  var edges = [];
                  /** MAIN SVG **/
                  var svg = d3.select(settings.appendElSpec).append("svg")
                    .attr("width", width)
                    .attr("height", height);
                  var graph = new GraphCreator(svg, nodes, edges);
                  graph.setIdCt(1);
                  graph.updateGraph();  
                };
                
                scope.loadGraphFunction = function(event, graph){
                  console.log("listen load-graph");
                  event.stopPropagation();
                  var docEl = document.documentElement,
                  bodyEl = document.getElementById('graph'),
                  svgEl= document.getElementsByTagName('svg');
                  var index;
                  for (index = svgEl.length - 1; index >= 0; index--) {
                    svgEl[index].parentNode.removeChild(svgEl[index]);
                  };
                  var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
                  height =  400;//window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
                  var xLoc = width/2 - 25,
                  yLoc = 100;
                  if(typeof(graph)=="string"){
                    graph = JSON.parse(graph);
                  };
                  var nodes = graph.nodes;
                  var transformEdges = graph.edges;
                  transformEdges.forEach(function(e, i){
                    transformEdges[i] = {source: nodes.filter(function(n){return n.id == e.source;})[0],
                    target: nodes.filter(function(n){return n.id == e.target;})[0],
                    eventModel: e.eventModel};
                  });
                  var edges = transformEdges;
                  var svg = d3.select(settings.appendElSpec).append("svg")
                    .attr("width", width)
                    .attr("height", height);
                  var graph = new GraphCreator(svg, nodes, edges);
                  graph.setIdCt(nodes.length + 1);
                  graph.updateGraph();
                };

                scope.$on("reload-graph", scope.loadGraphFunction);

                scope.$on("load-graph", scope.loadGraphFunction);

                scope.$on("new-graph", scope.newGraphFunction);

                scope.$broadcast("directiveReady");
              })
            }
        };
        return directive;
    }

})();