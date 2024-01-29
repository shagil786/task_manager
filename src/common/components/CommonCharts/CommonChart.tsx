import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface CommonChartPorps {
  data: { name: string; value: number }[];
}

const CommonChart: React.FC<CommonChartPorps> = ({ data }) => {
  const svgRef = useRef<any>();

  useEffect(() => {
    const contaienrWidth = svgRef?.current?.parentElement;
    if (!contaienrWidth) return;

    const width = contaienrWidth?.getBoundingClientRect()?.width;
    const height = Math.min(width, 500);

    const color: any = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => d.name))
      .range(["rgb(209, 60, 75)", "rgb(105, 189, 169)", "rgb(254, 238, 163)"]);

    const pie = d3
      .pie<{ name: string; value: number }>()
      .sort(null)
      .value((d) => d.value);

    const arc: any = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

    const labelRadius: any = arc.outerRadius()() * 0.5;

    const arcLabel: any = d3
      .arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const arcs = pie(data);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "font-size: 16px;");

    svg
      .append("g")
      .attr("stroke", "white")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc)
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", "lightblue");
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", (d: any) => color(d.data.name));
      })
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => (d.data.value == 0 ? "" : d.data.name)),
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString("en-US")),
      );
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default CommonChart;
