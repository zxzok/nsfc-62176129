window.PAGE_DATA = {
  "meta": {
    "generated_at": "2026-02-15T18:03:05Z",
    "source_paper": "Temporal dynamics in psychological assessments: a novel dataset with scales and response times (Scientific Data, 2024)",
    "evidence_policy": "关键断言均尽量提供（证据：页码/图号/表号）。若论文未报告则标注“论文未报告”。"
  },
  "slug": "response-time-psych-assessment-dataset",
  "seo_title": "把作答时间加入心理问卷：24,292名大学生四量表开放数据集",
  "seo_description": "论文发布一份包含逐题作答时间（秒）与四个常用心理量表分数的开放数据集，来自2021年一次校园筛查。作答时间为识别潜在粗心作答、理解作答行为和改进线上筛查提供了客观线索。",
  "keywords": [
    "心理健康筛查",
    "线上问卷",
    "作答时间",
    "反应时",
    "PHQ-9",
    "GAD-7",
    "ISI",
    "PSS",
    "粗心作答",
    "数据集",
    "Scientific Data",
    "GLMM"
  ],
  "sections": [
    {
      "id": "hero",
      "heading": "心理问卷不只看答案：把“作答时间”也变成数据",
      "body_markdown": "**副标题：** 24,292名大学生的PHQ-9、GAD-7、ISI、PSS作答记录与逐题秒级作答时间开放数据集（Scientific Data, 2024）",
      "citations": [
        "第1页 摘要",
        "第3页 Data quality control"
      ]
    },
    {
      "id": "read-30s",
      "heading": "30秒读懂",
      "body_markdown": "线上心理筛查很方便，但在“自由环境”里，有人可能不认真作答，导致结果失真。\n这篇论文发布一份来自校园筛查的开放数据集：不仅保存四个常用量表的逐题答案，还记录每一题用了多少秒。\n作者报告：ISI与PSS的总作答时间分布呈明显双峰，并在约12秒（ISI）与23秒（PSS）附近出现拐点；题目字数每多1个词，作答时间平均约多0.075秒。\n这让研究者能用更客观的行为线索识别潜在无效问卷，并改进线上筛查与量表设计。",
      "citations": [
        "第1页 摘要",
        "第4页 Fig.1及相邻正文",
        "第5页 Quantitative validation",
        "第3页 Table 2",
        "第5–6页 Usage Notes"
      ]
    },
    {
      "id": "why",
      "heading": "为什么要做这个研究",
      "body_markdown": "论文指出：心理健康问题上升，使大规模、互联网化的心理筛查越来越常见；它能让更多人快速获得初步线索，也有助于更早介入与治疗。\n但互联网评估与临床诊断之间仍可能存在差距；自由环境下也可能出现不认真作答。文献中“粗心作答”（CR）的比例可从1%到50%不等，足以改变变量关系、影响研究结论。\n因此作者希望引入更客观的补充信号：作答时间（RT）——每道题从出现到点击选项之间的秒数。",
      "citations": [
        "第1页 Background & Summary第1–2段",
        "第2页 关于RT与CR识别的段落"
      ]
    },
    {
      "id": "how",
      "heading": "我们怎么做的：把问卷变成“带秒表的答题轨迹”",
      "body_markdown": "研究基于新乡医学院一次全校心理筛查项目，时间为2021年2月27日至3月17日。学生自愿参加；研究通过伦理审批，并在线获取知情同意（含数据共享）。\n参与者按顺序完成：人口学信息 → PHQ-9 → GAD-7 → PSS → ISI。论文说明使用量表中文版本；题目文本与计分细节在补充材料与GitHub仓库中提供。\n作答时间记录方式：进入新题目记录时间戳t_start，选择答案记录时间戳t_end，RT=t_end−t_start（秒，保留两位小数）。\n质量控制：24,367人完成问卷，剔除75份缺失后纳入24,292人。论文提醒网络条件可能影响RT，但采集在同一校园内，地域差异较小。\n数据以5个CSV发布：demographic.csv + 四个量表CSV；量表CSV含score、questionX、timeX（秒），用export_id联表。原始与清洗数据均已匿名化并在Zenodo发布。",
      "citations": [
        "第1页 摘要",
        "第2页 Data collection",
        "第2页 Collection settings",
        "第2页 Measurement instruments",
        "第3页 Data generation process",
        "第3页 Data quality control",
        "第3页 Table 1",
        "第3页 Data Records"
      ]
    },
    {
      "id": "findings",
      "heading": "我们发现了什么：三个最重要的观察",
      "body_markdown": "### 发现1：大多数人处在较低症状/压力区间，但仍存在更高等级“长尾”\n论文报告PHQ-9最轻69.51%（16,886人）、GAD-7最轻83.03%（20,170人）、ISI无临床意义失眠90.94%（22,090人）、PSS中等压力61.27%（14,884人），并给出更高等级人数与比例。\n### 发现2：ISI与PSS总作答时间呈双峰，并在约12秒/23秒出现拐点\n论文在Fig.1指出ISI与PSS时间分布双峰，并描述约12秒（ISI）与23秒（PSS）附近的拐点；作者倾向将更短作答时间群体视作可能存在粗心作答，需要谨慎处理。\n### 发现3：题目字数越多，平均作答越慢（0.075秒/词）\n论文GLMM结果：word count系数0.075（SE=0.001，p<0.001），解释为每增加1个词，作答时间约增加0.075秒。",
      "citations": [
        "第3–4页 Technical Validation—Descriptive validation",
        "第4页 Fig.1及相邻正文",
        "第5页 Quantitative validation",
        "第3页 Table 2"
      ]
    },
    {
      "id": "so-what",
      "heading": "这项研究有什么用",
      "body_markdown": "论文提出该数据集可用于：研究疫情期间大学生心理状态、识别无效/粗心作答、按作答行为分型，以及为量表改版提供依据。\n同时论文提醒：作答时间受多因素影响；自评问卷存在社会称许性与回忆偏差。因此RT不应被当作个人诊断依据，更适合作为群体研究与数据质量控制的线索。",
      "citations": [
        "第2页 Background & Summary用途列表",
        "第5–6页 Usage Notes",
        "第6页 Limitations"
      ]
    },
    {
      "id": "get-data",
      "heading": "数据与代码在哪里：如何复用这份资源",
      "body_markdown": "论文说明数据（5个CSV，含原始与清洗版本）发布在Zenodo；并提供用于格式化、清洗与质控的Python代码仓库。\n本内容包不直接附带原始数据（建议以论文官方仓库为准），但提供：页面文案、可复用图片、可执行交互方案与生成衍生数据的脚本模板。",
      "citations": [
        "第3页 Data Records",
        "第6页 Code availability",
        "第7页 Reference 36",
        "第3页 Table 1"
      ]
    },
    {
      "id": "limitations",
      "heading": "局限性与下一步",
      "body_markdown": "论文指出：自评问卷存在社会称许性与回忆偏差；样本主要来自单一学校限制推广性；作答时间变化原因复杂（认真思考或分心干扰均可能），需要审慎处理。\n下一步通常包括：在更多地区/人群重复采集类似数据，检验稳定性；并发展方法区分“慢是认真”还是“慢是被打断”，降低误判风险。",
      "citations": [
        "第6页 Limitations"
      ]
    },
    {
      "id": "take-home",
      "heading": "一句话带走",
      "body_markdown": "把“作答时间”加入问卷，让线上筛查更可靠。",
      "citations": [
        "第1页 摘要",
        "第2页 关于RT价值的段落"
      ]
    }
  ],
  "visual_assets": [
    {
      "id": "va-dataset-files",
      "title": "数据集结构：5个CSV文件用 export_id 关联",
      "type": "示意图（SVG）",
      "file": "assets/diagrams/dataset_files.svg",
      "source_ref": "第3页 Table 1",
      "core_message": "人口学信息与四个量表分开存放，但可用同一ID联表。",
      "caption": "五个CSV文件，用 export_id 串起人口学与四量表。",
      "alt_text": "信息图展示数据集由5个CSV组成：demographic.csv含性别、年龄等；phq9/gad7/pss/isi四文件含总分score、逐题得分questionX与逐题作答时间timeX（秒）。所有文件用export_id对齐，便于联表分析。"
    },
    {
      "id": "va-participants",
      "title": "参与者画像（最终纳入）",
      "type": "信息图（SVG）",
      "file": "assets/diagrams/participants_profile.svg",
      "source_ref": "第3页 Data quality control",
      "core_message": "最终纳入24,292人，形成898,804条逐题作答记录。",
      "caption": "最终纳入24,292人，形成898,804条逐题记录。",
      "alt_text": "信息图用数字卡片概括样本：最终纳入24,292名学生；男性8,747人、女性15,545人；平均年龄20.65岁（SD=2.4）。四个量表合计形成898,804条逐题作答记录，便于研究作答行为。"
    },
    {
      "id": "va-rt-logging",
      "title": "逐题作答时间（RT）如何产生",
      "type": "流程图（SVG）",
      "file": "assets/diagrams/rt_logging.svg",
      "source_ref": "第3页 Data generation process；第2页 Collection settings",
      "core_message": "系统用两次时间戳之差得到每题作答秒数。",
      "caption": "进入题目记t_start，选答案记t_end，相减得RT。",
      "alt_text": "流程图展示RT计算：进入新题时记录开始时间戳t_start；选择答案时记录结束时间戳t_end；两者相减得到作答时间RT，单位秒并保留两位小数。该行为数据与答案一起保存，用于分析作答过程。"
    },
    {
      "id": "va-four-scales",
      "title": "四把“尺子”：抑郁、焦虑、压力与睡眠",
      "type": "示意图（SVG）",
      "file": "assets/diagrams/four_scales.svg",
      "source_ref": "第2页 Methods；第2页 Collection settings；第2页 Measurement instruments",
      "core_message": "同一批人完成四个维度量表，便于联合分析。",
      "caption": "PHQ-9/GAD-7/PSS/ISI分别对应四类心理维度。",
      "alt_text": "示意图用四张卡片表示四个量表：PHQ-9对应抑郁维度，GAD-7对应焦虑维度，PSS对应主观压力，ISI对应失眠严重度/睡眠困扰。问卷顺序为人口学信息后依次PHQ-9、GAD-7、PSS、ISI。"
    },
    {
      "id": "va-fig1",
      "title": "四量表“总分”和“总作答时间”分布（论文Fig.1）",
      "type": "论文原图复用（PNG）",
      "file": "assets/figures/fig1.png",
      "thumbnail": "assets/figures/fig1_thumb.jpg",
      "source_ref": "第4页 Fig.1及图注；第4页 相邻正文",
      "core_message": "分数分布之外，ISI与PSS的总作答时间呈双峰并出现拐点提示。",
      "caption": "ISI与PSS的总作答时间呈双峰，并出现拐点提示。",
      "alt_text": "图中包含8个子图，分别展示PHQ-9、GAD-7、ISI、PSS的总作答时间分布与总分分布。每个子图用直方图叠加KDE曲线。论文指出ISI与PSS的时间分布呈双峰，并在约12秒与23秒附近出现拐点。"
    },
    {
      "id": "va-fig2",
      "title": "逐题作答时间随题号变化（论文Fig.2）",
      "type": "论文原图复用（JPEG）",
      "file": "assets/figures/fig2.jpeg",
      "thumbnail": "assets/figures/fig2_thumb.jpg",
      "source_ref": "第5页 Fig.2及图注",
      "core_message": "不同题目平均耗时不同，且随题目进程变化。",
      "caption": "逐题中位数RT与误差带，呈现作答过程差异。",
      "alt_text": "图中四个面板分别对应PHQ-9、GAD-7、PSS、ISI各题的作答时间中位数（秒）。每条线周围的阴影为误差带，表示标准差乘0.5。该图用于比较不同题目与题序上的耗时变化与个体差异。"
    },
    {
      "id": "va-cr-rt-concept",
      "title": "“短作答时间”可能意味着什么？",
      "type": "概念示意图（SVG）",
      "file": "assets/diagrams/cr_rt_concept.svg",
      "source_ref": "第4页 Fig.1相邻正文；第6页 Limitations",
      "core_message": "短作答时间可能提示CR，但也可能来自干扰，不能简单下结论。",
      "caption": "时间是质量线索，不是诊断结论。",
      "alt_text": "概念图分两栏：左侧提示短作答时间可能与粗心作答有关，论文建议分析中谨慎对待；右侧强调短或长也可能来自分心、被打断或网络等因素。底部提醒：作答时间是数据质量线索，应与分数等信息一起解读。"
    },
    {
      "id": "va-cleaning-flow",
      "title": "数据质量控制：样本剔除 + MAD规则",
      "type": "流程图（SVG）",
      "file": "assets/diagrams/cleaning_flow.svg",
      "source_ref": "第3页 Data quality control；第4页 median/MAD规则段落",
      "core_message": "先剔除缺失值，再用median与MAD识别极端异常RT用于后续分析。",
      "caption": "缺失剔除与RT异常筛选，让后续分析更稳健。",
      "alt_text": "流程图先展示样本清洗：24,367人完成问卷，剔除75份缺失后得到24,292人。随后展示RT异常筛选规则：对每个量表总作答时间计算中位数与MAD，标准化偏差超过5×MAD者在后续分析中被排除。"
    },
    {
      "id": "va-wordcount-effect",
      "title": "题目更长会更慢：0.075秒/词（GLMM）",
      "type": "信息图（SVG）",
      "file": "assets/diagrams/wordcount_effect.svg",
      "source_ref": "第5页 Quantitative validation；第3页 Table 2；第6页 Limitations",
      "core_message": "字数系统性拉长作答时间，提醒问卷设计的时间成本。",
      "caption": "每多1个词，平均多约0.075秒。",
      "alt_text": "信息图用公式说明字数效应：预计额外时间Δt=0.075×额外词数Δwords，并给出示例“多10个词约多0.75秒”。图下提醒：该结果来自GLMM的群体统计关系，说明阅读负担会影响RT，不能用于个人诊断。"
    },
    {
      "id": "va-reuse-pipeline",
      "title": "如何复用这份数据：从下载到分析（路线图）",
      "type": "流程图（SVG）",
      "file": "assets/diagrams/reuse_pipeline.svg",
      "source_ref": "第3页 Data Records；第6页 Code availability；第5–6页 Usage Notes",
      "core_message": "把论文资源转成可复用流程，帮助读者理解“怎么用”。",
      "caption": "从下载、联表到建模与应用，一图看懂复用路径。",
      "alt_text": "流程图按步骤展示复用路径：从Zenodo下载5个CSV数据；用export_id联表整合人口学与四量表；生成总作答时间与逐题统计等衍生指标；进行分布探索、异常识别与行为模式建模；最终服务于数据质控与问卷/量表优化。"
    }
  ],
  "interactive_modules": [
    {
      "id": "im-distribution-explorer",
      "title": "分数与总作答时间分布探索器",
      "purpose": "让公众直观看到四个量表的分数分布与总作答时间分布，并理解论文为何强调时间维度。",
      "ui_controls": [
        {
          "control": "tabs",
          "label": "选择量表",
          "options": [
            "PHQ-9",
            "GAD-7",
            "ISI",
            "PSS"
          ]
        },
        {
          "control": "toggle",
          "label": "选择指标",
          "options": [
            "score_total",
            "total_response_time_sec"
          ]
        },
        {
          "control": "checkbox",
          "label": "显示拐点提示",
          "options": [
            "on"
          ]
        }
      ],
      "schema_ref": "schemas/distribution_bins.schema.json",
      "source_ref": "第3页 Table 1；第4页 Fig.1及相邻正文"
    },
    {
      "id": "im-item-rt-timeline",
      "title": "逐题作答时间时间轴",
      "purpose": "展示每道题的作答时间中位数与波动，帮助公众理解作答过程与个体差异。",
      "ui_controls": [
        {
          "control": "dropdown",
          "label": "选择量表",
          "options": [
            "PHQ-9",
            "GAD-7",
            "PSS",
            "ISI"
          ]
        },
        {
          "control": "hover",
          "label": "查看题目详情",
          "options": [
            "median_rt_sec",
            "sd_rt_sec"
          ]
        }
      ],
      "schema_ref": "schemas/item_rt_summary.schema.json",
      "source_ref": "第3页 Table 1；第5页 Fig.2与图注"
    },
    {
      "id": "im-wordcount-calculator",
      "title": "字数—时间影响计算器",
      "purpose": "用滑杆把论文统计结果变成直观体验：题目字数增加会带来多少额外作答时间。",
      "ui_controls": [
        {
          "control": "slider",
          "label": "额外增加的词数",
          "min": 0,
          "max": 200,
          "step": 1
        },
        {
          "control": "readout",
          "label": "预计多花的秒数",
          "format": "0.00s"
        }
      ],
      "schema_ref": "schemas/wordcount_effect.schema.json",
      "source_ref": "第5页 Quantitative validation；第3页 Table 2"
    }
  ],
  "disclaimer": "本页面为科普用途，解释论文发布的数据集与群体层面的统计观察，不构成医学或心理临床诊断建议。在线评估与临床诊断可能存在差距；自评与作答时间均可能受多因素影响，不能单独用于判断个人状态或真实性。若有心理困扰，请咨询专业医疗/心理服务。（证据：论文第1页 Background & Summary关于线上评估与临床差距；第6页 Limitations）"
};
