/* Auto-generated data (from paper evidence anchors). */
window.MCN_DATA = {
  "metadata": {
    "mdset_count": 27,
    "evidence": "PDF第5页（C6）",
    "notes": "本数据只包含论文正文明确报告的AMCS数值；其余边的AMCS需要从作者代码或补充材料Table S1提取（见C6/C10）。"
  },
  "modules": [
    {
      "id": "DRM",
      "name_zh": "抑郁模块",
      "type": "emotional"
    },
    {
      "id": "ARM",
      "name_zh": "焦虑模块",
      "type": "emotional"
    },
    {
      "id": "SRM",
      "name_zh": "睡眠相关模块",
      "type": "non_emotional"
    },
    {
      "id": "NSM",
      "name_zh": "负向压力模块",
      "type": "non_emotional"
    },
    {
      "id": "PSM",
      "name_zh": "正向压力模块",
      "type": "non_emotional"
    },
    {
      "id": "SUM",
      "name_zh": "自杀相关单条目模块",
      "type": "single_item"
    }
  ],
  "edges": [
    {
      "from": "SRM",
      "to": "PSM",
      "amcs": 0.586,
      "evidence": "PDF第5页（C6）"
    },
    {
      "from": "PSM",
      "to": "ARM",
      "amcs": 0.497,
      "evidence": "PDF第5页（C6）"
    },
    {
      "from": "SRM",
      "to": "DRM",
      "amcs": 0.444,
      "evidence": "PDF第5页（C6）"
    },
    {
      "from": "DRM",
      "to": "SRM",
      "amcs": 0.042,
      "evidence": "PDF第5页（C6）"
    },
    {
      "from": "ARM",
      "to": "NSM",
      "amcs": 0.042,
      "evidence": "PDF第5页（C6）"
    },
    {
      "from": "DRM",
      "to": "NSM",
      "amcs": 0.019,
      "evidence": "PDF第5页（C6）"
    }
  ]
};

window.CF_TOP5_DATA = {
  "metadata": {
    "node_count": 37,
    "driver_node_count": 24,
    "evidence": "PDF第6页（C7）",
    "notes": "论文仅在正文给出Top5 CF数值；完整CF列表需从补充材料/代码提取。"
  },
  "top5": [
    {
      "node": "PHQ9",
      "cf": 1.0,
      "module": "SUM",
      "note": "自杀条目模块（单条目）",
      "evidence": "PDF第6页（C7）"
    },
    {
      "node": "ISI4",
      "cf": 0.778,
      "module": "SRM",
      "note": "睡眠相关模块",
      "evidence": "PDF第6页（C7）"
    },
    {
      "node": "PSS2",
      "cf": 0.444,
      "module": "PSM",
      "note": "正向压力模块",
      "evidence": "PDF第6页（C7）"
    },
    {
      "node": "PSS7",
      "cf": 0.37,
      "module": "NSM",
      "note": "负向压力模块",
      "evidence": "PDF第6页（C7）"
    },
    {
      "node": "GAD6",
      "cf": 0.222,
      "module": "ARM",
      "note": "焦虑模块",
      "evidence": "PDF第6页（C7）"
    }
  ]
};
