import React from "react";
import { Pie, G2 } from "@ant-design/charts";
export default function PieGraph({
  data = [
    {
      type: "New Co-Owner",
      value: 30,
    },
    {
      type: "Co-Owner",
      value: 1470,
    },
  ],
  colors = ["#A3BA46", "#EDD868", "#ED1C24"],
}) {
  const { registerTheme } = G2;
  registerTheme("custom-theme", {
    colors10: colors,
  });
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    theme: "custom-theme",
  };
  return <Pie {...config} />;
}
