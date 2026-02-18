window.PAGE_CONTENT = {
  "slug": "abafnet-speech-depression-detection",
  "seo_title": "用声音识别抑郁：ABAFnet多特征融合模型（语音抑郁检测）",
  "seo_description": "这篇论文提出ABAFnet：把包络、声谱图、Mel声谱图与OpenSMILE统计特征融合，用注意力机制与动态加权提升语音抑郁检测。在临床中文朗读语音CNRAC上AUC达0.85±0.04，并分析了关键模块与MFCC/Mel相关线索。",
  "keywords": [
    "抑郁",
    "语音抑郁检测",
    "声学特征融合",
    "注意力机制",
    "LSTM",
    "OpenSMILE",
    "MFCC",
    "Mel-spectrogram",
    "ABAFnet",
    "CNRAC",
    "PHQ-9",
    "HAMD-17"
  ],
  "sections": [
    {
      "id": "hero",
      "heading": "用声音识别抑郁：AI在“听”什么？",
      "body_markdown": "**副标题：ABAFnet融合4类声学特征，在临床中文朗读语音上达到AUC 0.85±0.04**（证据：第1页摘要；第8页表5）",
      "citations": [
        "第1页 摘要",
        "第8页 表5"
      ]
    },
    {
      "id": "quick",
      "heading": "30秒读懂",
      "body_markdown": "问题：抑郁评估常依赖访谈与量表，耗时且可能受主观因素影响。（证据：第1页引言第1段）\n\n方法：朗读语音→VAD剪掉非人声→统一采样率→提取4类特征→用注意力机制与动态加权融合（ABAFnet）进行分类。（证据：第3页3.2.1；第4页图1；第5页图2；第6页式14–17）\n\n发现：在临床数据CNRAC上，融合模型AUC 0.85±0.04、ACC 0.81±0.04，优于任何单一特征。（证据：第8页表5）\n\n意义：多线索融合可能让语音辅助筛查更稳定，但仍需要更多场景与人群验证。（证据：第11页结论；第12页附录B）",
      "citations": [
        "第1页 引言",
        "第3页 3.2.1",
        "第4页 图1",
        "第5页 图2",
        "第6页 式14–17",
        "第8页 表5",
        "第11页 结论",
        "第12页 附录B/表15"
      ]
    },
    {
      "id": "why",
      "heading": "为什么要做这个研究",
      "body_markdown": "抑郁是一种常见精神障碍，会显著影响身心健康，严重时甚至危及生命；论文指出COVID-19后病例上升并带来社会经济负担。（证据：第1页引言第1段）\n\n现实中，抑郁的评估往往依赖医生访谈与量表（如HAMD），流程可能耗时、结果也可能受主观因素与医生经验影响。（证据：第1页引言第1段）\n\n作者将语音视为一种潜在的“行为标记”，并指出很多现有方法偏向单一特征，可能忽略语音里不同层次的信息；此外，不同特征形态差异大，需要更合适的提取与融合策略。（证据：第1–2页引言；第2页三大问题）",
      "citations": [
        "第1页 引言",
        "第2页 三大问题/动机"
      ]
    },
    {
      "id": "how",
      "heading": "我们怎么做的",
      "body_markdown": "可以把朗读语音想象成一部“电影”：既有随时间变化的剧情，也有不同频率上的纹理。作者做法是：从4个角度提取线索，再让模型学会在不同情境下动态分配权重。（证据：第1页摘要；第4页图1；第6页式14–17）\n\n流程包括：\n1）预处理：VAD去除静音与非人声；把临床录音从44.1kHz重采样到16kHz。（证据：第3页3.2.1）\n2）特征：包络、声谱图、Mel声谱图、OpenSMILE emoLarge统计特征（6552维）。（证据：第4页3.2.2–3.2.3；第4页表1）\n3）模型：TAC按“图像型/向量型”特征分别卷积；LAM用LSTM+注意力处理时间序列；LLFN通过DWA动态调整4路融合权重（式14–17）。（证据：第5–6页3.3；第6页式14–17）\n4）评估：在CNRAC上7:2:1划分训练/验证/测试，并做10折交叉验证与早停训练。（证据：第7页4.2）",
      "citations": [
        "第1页 摘要",
        "第3页 3.2.1",
        "第4页 图1/表1",
        "第5–6页 3.3",
        "第6页 式14–17",
        "第7页 4.2"
      ]
    },
    {
      "id": "findings",
      "heading": "我们发现了什么",
      "body_markdown": "### 发现1：融合显著优于单一特征\n在CNRAC二分类任务上，融合模型ACC 0.81±0.04、AUC 0.85±0.04；而单一特征中表现最好的是Mel-spectrogram（ACC 0.75±0.05、AUC 0.80±0.03）。（证据：第8页表5）\n\n### 发现2：严重度任务“健康 vs 中重度”更容易，相邻亚型更难\n例如“NC vs Moderate”AUC 0.95±0.04，而“Mild vs Moderate”AUC 0.79±0.22。（证据：第9页表7）\n\n### 发现3：关键模块与MFCC/Mel相关线索被多次验证\n消融实验显示去掉LSTM会显著降低性能（ACC 0.65±0.20、F1 0.48±0.29）。（证据：第9页表9）\n解释性分析中，32个显著差异HSFs里，MFCC与Mel谱相关各占43.75%，合计87.5%。（证据：第10页4.6；第10页表10）",
      "citations": [
        "第8页 表5",
        "第9页 表7",
        "第9页 表9",
        "第10页 表10/4.6"
      ]
    },
    {
      "id": "use",
      "heading": "这项研究有什么用",
      "body_markdown": "证据支持的：\n1）在作者的临床朗读语音设置下，ABAFnet在多项指标上优于若干对比深度模型。（证据：第10页表11；第10页4.7.1）\n2）权重迁移验证显示从CNRAC到CS-NRAC的Transfer Validation可达ACC 0.89±0.02、F1 0.89±0.03。（证据：第12页表13）\n\n合理推测但论文未直接验证的：\n1）在标准化录音流程下，可能用于筛查初筛与随访辅助；但在家庭/手机随录、自然对话等更复杂场景，论文未报告效果。（证据：第7页4.1数据采集条件；第11页4.8对筛查与样本分布的讨论）",
      "citations": [
        "第10页 表11/4.7.1",
        "第12页 表13",
        "第7页 4.1",
        "第11页 4.8"
      ]
    },
    {
      "id": "limits",
      "heading": "局限性与下一步",
      "body_markdown": "论文明确指出：CS-NRAC中抑郁样本较少，不足以全面验证二分类能力；同时PHQ-9阈值划分存在可靠性争议，因此作者采用阈值区间做更细评估。（证据：第11页4.8；第11页表12）\n\n此外，ABAFnet因为要提取并处理四类特征，相比端到端模型训练更耗时。（证据：第11页4.7.2；第11页图5）\n\n附录还报告了性别与年龄相关的补充实验，提示不同人群上的表现存在差异，需要持续关注与验证。（证据：第12页附录B；第12页表15）",
      "citations": [
        "第11页 4.8/表12",
        "第11页 4.7.2/图5",
        "第12页 附录B/表15"
      ]
    },
    {
      "id": "ethics",
      "heading": "隐私与伦理",
      "body_markdown": "论文说明：CNRAC与CS-NRAC均取得参与者知情同意，并分别通过伦理审批（给出伦理批号）。（证据：第1页脚注）",
      "citations": [
        "第1页 脚注（informed consent/ethics）"
      ]
    },
    {
      "id": "resources",
      "heading": "代码与数据可用性",
      "body_markdown": "论文给出代码仓库地址，并说明“语音统计特征可在合理请求下获取”。（证据：第12页Data availability；第1页Dataset link）",
      "citations": [
        "第12页 Data availability",
        "第1页 Dataset link"
      ]
    },
    {
      "id": "disclaimer",
      "heading": "免责声明",
      "body_markdown": "本页面仅用于科研科普与方法解读，不构成医疗建议或诊断依据。若你或身边的人正在经历情绪困扰，请及时联系专业医疗机构或心理健康服务。",
      "citations": []
    }
  ],
  "visual_assets": [
    {
      "id": "vis_pipeline",
      "title": "从录音到四类特征：语音如何被“切成四种线索”",
      "type": "示意图（概念重绘）",
      "source_ref": "第4页图1；第3–4页3.2.1–3.2.3",
      "file": "assets/illustrations/pipeline_schematic.svg",
      "alt_text": "一张流程示意图：录音先经过语音活动检测去掉静音，再重采样统一到16kHz，随后提取四类特征：包络、声谱图、Mel声谱图与OpenSMILE统计特征，用于后续模型分析。"
    },
    {
      "id": "vis_arch",
      "title": "ABAFnet整体结构：四路输入如何在网络里融合",
      "type": "示意图（概念重绘）",
      "source_ref": "第5页图2；第5–6页3.3",
      "file": "assets/illustrations/abafnet_schematic.svg",
      "alt_text": "示意图展示ABAFnet：四种特征分别输入，先经TAC提取特征，再用LSTM+注意力模块处理时间序列，最后在LLFN中通过动态权重调整把四路信息融合，输出抑郁/非抑郁判断。"
    },
    {
      "id": "vis_datasets",
      "title": "两套数据集一眼看懂：CNRAC与CS-NRAC",
      "type": "信息卡片（概念重绘）",
      "source_ref": "第7页4.1；第7页表3–4",
      "file": "assets/illustrations/datasets_cards.svg",
      "alt_text": "两张并排信息卡：左侧CNRAC为临床朗读语音，包含155名抑郁与216名对照，使用HAMD-17评估；右侧CS-NRAC为大学新生筛查语音，共1561人，使用PHQ-9自评并强调非诊断。"
    },
    {
      "id": "vis_metrics",
      "title": "如何读懂ACC/Precision/Recall/AUC",
      "type": "信息图（概念重绘）",
      "source_ref": "第8页表5（指标使用）；第9页表9（消融）",
      "file": "assets/illustrations/metrics_explainer.svg",
      "alt_text": "一张指标解释图：用文字说明Accuracy、Precision、Recall与AUC的含义，并给出一个2×2混淆矩阵示例，标出TP、FP、FN、TN，帮助读者理解论文表格中的指标。"
    },
    {
      "id": "vis_table5_auc",
      "title": "融合为什么更强：AUC对比（CNRAC）",
      "type": "图表（基于论文表格重绘）",
      "source_ref": "第8页表5",
      "file": "assets/charts/table5_auc.png",
      "alt_text": "柱状图对比CNRAC上不同输入特征的AUC：融合模型最高约0.85，其次是Mel声谱图约0.80；声谱图约0.76；包络约0.66；HSFs约0.56，显示融合带来明显提升。"
    },
    {
      "id": "vis_table7_auc",
      "title": "哪些亚型更好分：不同任务AUC（CNRAC）",
      "type": "图表（基于论文表格重绘）",
      "source_ref": "第9页表7",
      "file": "assets/charts/table7_auc.png",
      "alt_text": "柱状图展示CNRAC亚型任务AUC：NC vs Moderate最高接近0.95；NC vs Severe约0.94；NC vs Mild约0.86；相邻亚型对比如Mild vs Moderate约0.79，整体更低且波动更大。"
    },
    {
      "id": "vis_ablation",
      "title": "模型里哪块最关键：消融实验F1对比",
      "type": "图表（基于论文表格重绘）",
      "source_ref": "第9页表9；第8页表5（完整模型）",
      "file": "assets/charts/table9_f1.png",
      "alt_text": "柱状图比较完整模型与消融版本F1：完整融合模型约0.70；去掉Attention约0.72接近完整；去掉DWA降到约0.52；去掉LSTM降到约0.48，显示LSTM对性能影响最大。"
    },
    {
      "id": "vis_threshold",
      "title": "阈值怎么选会影响结果：PHQ-9阈值与召回率",
      "type": "图表（基于论文表格重绘）",
      "source_ref": "第11页表12",
      "file": "assets/charts/table12_recall.png",
      "alt_text": "折线图展示CS-NRAC上不同PHQ-9阈值的召回率：Mild Left区间(3–5)召回率约0.85左右；Mild Right区间(8–10)在阈值8时召回率很低约0.05，阈值10时为0，提示样本稀少导致不稳定。"
    }
  ],
  "interactive_modules": [
    {
      "id": "mod_perf_explorer",
      "title": "表现对比器：单特征 vs 融合（CNRAC）",
      "purpose": "让公众直观看到：不同语音特征各自能做到什么水平，以及融合带来的提升。",
      "ui_controls": [
        {
          "type": "select",
          "label": "选择指标",
          "options": [
            "AUC",
            "ACC",
            "Precision",
            "Recall",
            "F1"
          ],
          "default": "AUC"
        },
        {
          "type": "toggle",
          "label": "显示±标准差",
          "default": true
        }
      ],
      "schema": {
        "description": "来自论文表5：CNRAC二分类任务上，不同输入特征/融合的评估指标（均值与标准差）。",
        "fields": [
          {
            "name": "Models",
            "type": "string",
            "unit": null,
            "allowed_range": "Upper Envelope|Spectrogram|MelSpectrogram|HSFs|Fusion",
            "missing": "不允许缺失",
            "source_ref": "第8页表5"
          },
          {
            "name": "metric",
            "type": "string",
            "unit": null,
            "allowed_range": "ACC|Precision|Recall|F1|AUC",
            "missing": "不允许缺失",
            "source_ref": "第8页表5"
          },
          {
            "name": "value_mean",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "不允许缺失",
            "source_ref": "第8页表5"
          },
          {
            "name": "value_sd",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "允许为0；若论文未给则设为null",
            "source_ref": "第8页表5"
          }
        ]
      },
      "source_ref": "第8页表5"
    },
    {
      "id": "mod_subtype_matrix",
      "title": "亚型任务难度地图（CNRAC）",
      "purpose": "把不同严重度对比任务放在同一张“地图”上，帮助理解：哪些对比更容易、哪些更难。",
      "ui_controls": [
        {
          "type": "select",
          "label": "任务组",
          "options": [
            "NC-Subtype",
            "Inter-Subtype"
          ],
          "default": "NC-Subtype"
        },
        {
          "type": "select",
          "label": "指标",
          "options": [
            "AUC",
            "ACC",
            "Precision",
            "Recall",
            "F1"
          ],
          "default": "AUC"
        },
        {
          "type": "toggle",
          "label": "显示±标准差",
          "default": true
        }
      ],
      "schema": {
        "description": "来自论文表7：CNRAC上不同亚型分类任务的指标（均值与标准差）。",
        "fields": [
          {
            "name": "Task_Group",
            "type": "string",
            "unit": null,
            "allowed_range": "NC-Subtype|Inter-Subtype",
            "missing": "不允许缺失",
            "source_ref": "第9页表7"
          },
          {
            "name": "Task",
            "type": "string",
            "unit": null,
            "allowed_range": "论文表7列出的任务名称",
            "missing": "不允许缺失",
            "source_ref": "第9页表7"
          },
          {
            "name": "metric",
            "type": "string",
            "unit": null,
            "allowed_range": "ACC|Precision|Recall|F1|AUC",
            "missing": "不允许缺失",
            "source_ref": "第9页表7"
          },
          {
            "name": "value_mean",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "不允许缺失",
            "source_ref": "第9页表7"
          },
          {
            "name": "value_sd",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "允许为0；若论文未给则设为null",
            "source_ref": "第9页表7"
          }
        ]
      },
      "source_ref": "第9页表7"
    },
    {
      "id": "mod_threshold_sandbox",
      "title": "PHQ-9阈值沙盒（CS-NRAC）",
      "purpose": "通过拖动阈值，理解：同一模型在不平衡筛查数据上，阈值选择会怎样影响召回率/精确率。",
      "ui_controls": [
        {
          "type": "select",
          "label": "阈值区间",
          "options": [
            "Mild Left",
            "Mild Right"
          ],
          "default": "Mild Left"
        },
        {
          "type": "slider",
          "label": "阈值",
          "min": 3,
          "max": 10,
          "step": 1,
          "default": 4
        }
      ],
      "schema": {
        "description": "来自论文表12：CS-NRAC上不同PHQ-9端点阈值设置下的指标。",
        "fields": [
          {
            "name": "Endpoints",
            "type": "string",
            "unit": null,
            "allowed_range": "Mild Left|Mild Right",
            "missing": "不允许缺失",
            "source_ref": "第11页表12"
          },
          {
            "name": "Threshold",
            "type": "integer",
            "unit": "PHQ-9分数",
            "allowed_range": "[3,10]",
            "missing": "不允许缺失",
            "source_ref": "第11页表12"
          },
          {
            "name": "ACC",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "不允许缺失",
            "source_ref": "第11页表12"
          },
          {
            "name": "Precision",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "可为0",
            "source_ref": "第11页表12"
          },
          {
            "name": "Recall",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "可为0",
            "source_ref": "第11页表12"
          },
          {
            "name": "F1",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "可为0",
            "source_ref": "第11页表12"
          },
          {
            "name": "PR_AUC",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "不允许缺失",
            "source_ref": "第11页表12"
          }
        ]
      },
      "default_view_copy": "提示：PHQ-9是筛查量表而非临床诊断；样本稀少时，某些阈值可能导致模型几乎抓不到阳性案例。（证据：第7页4.1；第11页4.8；第11页表12）",
      "risk_note": "不要把这里的阈值/结果当作自测或诊断依据。",
      "source_ref": "第11页表12；第11页4.8"
    },
    {
      "id": "mod_ablation_builder",
      "title": "组件贡献拼装台（消融实验）",
      "purpose": "让读者通过对比数值直观看到：LSTM、Attention、DWA分别贡献了多少。",
      "ui_controls": [
        {
          "type": "select",
          "label": "指标",
          "options": [
            "ACC",
            "Precision",
            "Recall",
            "F1"
          ],
          "default": "F1"
        },
        {
          "type": "toggle",
          "label": "包含完整模型基线",
          "default": true
        }
      ],
      "schema": {
        "description": "来自论文表9（消融）与表5（完整模型基线）。",
        "fields": [
          {
            "name": "Variant",
            "type": "string",
            "unit": null,
            "allowed_range": "Full|LSTM removed|Attention removed|DWA removed",
            "missing": "不允许缺失",
            "source_ref": "第9页表9；第8页表5"
          },
          {
            "name": "metric",
            "type": "string",
            "unit": null,
            "allowed_range": "ACC|Precision|Recall|F1",
            "missing": "不允许缺失",
            "source_ref": "第9页表9；第8页表5"
          },
          {
            "name": "value_mean",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "不允许缺失",
            "source_ref": "第9页表9；第8页表5"
          },
          {
            "name": "value_sd",
            "type": "number",
            "unit": "0-1",
            "allowed_range": "[0,1]",
            "missing": "允许为0；若论文未给则设为null",
            "source_ref": "第9页表9；第8页表5"
          }
        ]
      },
      "source_ref": "第9页表9；第8页表5"
    }
  ],
  "disclaimer": "本页面仅用于科研科普与方法解读，不构成医疗建议或诊断依据。PHQ-9为筛查量表，不能替代临床诊断。（证据：第7页4.1；第11页4.8）"
};
