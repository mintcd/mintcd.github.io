import { drag } from 'd3-drag'
import { Simulation } from 'd3-force';
import { select, Selection } from 'd3-selection'
import { zoom, zoomIdentity, zoomTransform, ZoomBehavior } from 'd3-zoom'


export function dragBehavior(simulation: Simulation<Vertex, undefined>) {
  // simulation.nodes
  return drag()
    .on("start", function dragStartedHandler(event, d) {
      const v = d as Vertex;
      v.fx = v.x;
      v.fy = v.y;
    })
    .on("drag", function draggingHandler(event, d) {
      const v = d as Vertex;
      v.fx = event.x;
      v.fy = event.y;
      simulation.alphaTarget(0).restart()
    })
    .on("end", function dragEndedHandler(event, d) {
      const v = d as Vertex;
      if (!event.active) simulation.alphaTarget(0);
      v.fx = undefined;
      v.fy = undefined;
    });


}

export function zoomBehavior(graphContainer: Selection<SVGElement, null, null, null>, graph: Selection<SVGGElement, null, null, null>) {
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 3])
    .filter((event) => {
      // Allow zooming on wheel events and not on other events like drag
      return event.type === 'wheel' || event.type === 'dblclick';
    })
    .on('zoom', (event) => {
      graph.attr('transform', event.transform);
    });

  const handleZoom = (event: WheelEvent) => {

    event.preventDefault();

    const svg = graphContainer;
    const currentTransform = zoomTransform(graphContainer);
    const sensitivity = 0.001;

    const svgBounds = graphContainer.getBoundingClientRect();
    const mouseX = event.clientX - svgBounds.left;
    const mouseY = event.clientY - svgBounds.top;

    const scaleFactor = 1 - event.deltaY * sensitivity;
    const newScale = currentTransform.k * scaleFactor;
    const constrainedScale = Math.max(0.1, Math.min(newScale, 3));

    const x = currentTransform.x;
    const y = currentTransform.y;
    const k = currentTransform.k;

    const newX = mouseX - (mouseX - x) * (constrainedScale / k);
    const newY = mouseY - (mouseY - y) * (constrainedScale / k);

    const newTransform = zoomIdentity
      .translate(newX, newY)
      .scale(constrainedScale);

    svg
      .transition()
      .duration(50)
      .call(zoomBehavior.transform as any, newTransform);
  };

  const resetZoom = () => {
    graphContainer.transition()
      .duration(100)
      .call(zoomBehavior.transform as any, zoomIdentity);
  };

  const resetButton = select('#reset-button')
  resetButton.on('click', resetZoom);

  graphContainer.call(zoomBehavior as any)
    .on("wheel.zoom", handleZoom)
}
