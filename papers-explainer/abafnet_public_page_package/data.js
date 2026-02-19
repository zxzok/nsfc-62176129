window.DATA_TABLES = {
  "table5_cnrac_metrics": [
    {
      "Models": "Upper Envelope",
      "ACC_mean": 0.64,
      "ACC_sd": 0.05,
      "Precision_mean": 0.52,
      "Precision_sd": 0.1,
      "Recall_mean": 0.57,
      "Recall_sd": 0.14,
      "F1_mean": 0.52,
      "F1_sd": 0.06,
      "AUC_mean": 0.66,
      "AUC_sd": 0.06
    },
    {
      "Models": "Spectrogram",
      "ACC_mean": 0.69,
      "ACC_sd": 0.06,
      "Precision_mean": 0.61,
      "Precision_sd": 0.09,
      "Recall_mean": 0.73,
      "Recall_sd": 0.1,
      "F1_mean": 0.65,
      "F1_sd": 0.06,
      "AUC_mean": 0.76,
      "AUC_sd": 0.06
    },
    {
      "Models": "MelSpectrogram",
      "ACC_mean": 0.75,
      "ACC_sd": 0.05,
      "Precision_mean": 0.66,
      "Precision_sd": 0.07,
      "Recall_mean": 0.77,
      "Recall_sd": 0.1,
      "F1_mean": 0.7,
      "F1_sd": 0.03,
      "AUC_mean": 0.8,
      "AUC_sd": 0.03
    },
    {
      "Models": "HSFs",
      "ACC_mean": 0.64,
      "ACC_sd": 0.02,
      "Precision_mean": 0.46,
      "Precision_sd": 0.03,
      "Recall_mean": 0.43,
      "Recall_sd": 0.06,
      "F1_mean": 0.46,
      "F1_sd": 0.02,
      "AUC_mean": 0.56,
      "AUC_sd": 0.05
    },
    {
      "Models": "Fusion",
      "ACC_mean": 0.81,
      "ACC_sd": 0.04,
      "Precision_mean": 0.65,
      "Precision_sd": 0.09,
      "Recall_mean": 0.8,
      "Recall_sd": 0.13,
      "F1_mean": 0.7,
      "F1_sd": 0.03,
      "AUC_mean": 0.85,
      "AUC_sd": 0.04
    }
  ],
  "table6_val_test": [
    {
      "Set": "Validation",
      "ACC_mean": 0.83,
      "ACC_sd": 0.03,
      "Precision_mean": 0.68,
      "Precision_sd": 0.08,
      "Recall_mean": 0.82,
      "Recall_sd": 0.11,
      "F1_mean": 0.73,
      "F1_sd": 0.02,
      "AUC_mean": 0.87,
      "AUC_sd": 0.03
    },
    {
      "Set": "Test",
      "ACC_mean": 0.81,
      "ACC_sd": 0.04,
      "Precision_mean": 0.65,
      "Precision_sd": 0.09,
      "Recall_mean": 0.8,
      "Recall_sd": 0.13,
      "F1_mean": 0.7,
      "F1_sd": 0.03,
      "AUC_mean": 0.85,
      "AUC_sd": 0.04
    }
  ],
  "table7_cnrac_subtype": [
    {
      "Task_Group": "NC-Subtype",
      "Task": "NC vs Mild",
      "ACC_mean": 0.98,
      "ACC_sd": 0.02,
      "Precision_mean": 0.25,
      "Precision_sd": 0.27,
      "Recall_mean": 0.86,
      "Recall_sd": 0.24,
      "F1_mean": 0.31,
      "F1_sd": 0.24,
      "AUC_mean": 0.86,
      "AUC_sd": 0.18
    },
    {
      "Task_Group": "NC-Subtype",
      "Task": "NC vs Moderate",
      "ACC_mean": 0.93,
      "ACC_sd": 0.03,
      "Precision_mean": 0.7,
      "Precision_sd": 0.18,
      "Recall_mean": 0.85,
      "Recall_sd": 0.19,
      "F1_mean": 0.75,
      "F1_sd": 0.16,
      "AUC_mean": 0.95,
      "AUC_sd": 0.04
    },
    {
      "Task_Group": "NC-Subtype",
      "Task": "NC vs Severe",
      "ACC_mean": 0.94,
      "ACC_sd": 0.03,
      "Precision_mean": 0.72,
      "Precision_sd": 0.22,
      "Recall_mean": 0.85,
      "Recall_sd": 0.19,
      "F1_mean": 0.73,
      "F1_sd": 0.16,
      "AUC_mean": 0.94,
      "AUC_sd": 0.08
    },
    {
      "Task_Group": "Inter-Subtype",
      "Task": "Mild vs Moderate",
      "ACC_mean": 0.86,
      "ACC_sd": 0.19,
      "Precision_mean": 0.76,
      "Precision_sd": 0.35,
      "Recall_mean": 0.64,
      "Recall_sd": 0.39,
      "F1_mean": 0.66,
      "F1_sd": 0.36,
      "AUC_mean": 0.79,
      "AUC_sd": 0.22
    },
    {
      "Task_Group": "Inter-Subtype",
      "Task": "Mild vs Severe",
      "ACC_mean": 0.94,
      "ACC_sd": 0.05,
      "Precision_mean": 0.85,
      "Precision_sd": 0.27,
      "Recall_mean": 0.65,
      "Recall_sd": 0.36,
      "F1_mean": 0.7,
      "F1_sd": 0.32,
      "AUC_mean": 0.81,
      "AUC_sd": 0.21
    },
    {
      "Task_Group": "Inter-Subtype",
      "Task": "Moderate vs Severe",
      "ACC_mean": 0.86,
      "ACC_sd": 0.06,
      "Precision_mean": 0.83,
      "Precision_sd": 0.08,
      "Recall_mean": 0.82,
      "Recall_sd": 0.16,
      "F1_mean": 0.81,
      "F1_sd": 0.11,
      "AUC_mean": 0.9,
      "AUC_sd": 0.07
    }
  ],
  "table9_ablation": [
    {
      "Ablated_Module": "LSTM",
      "ACC_mean": 0.65,
      "ACC_sd": 0.2,
      "Precision_mean": 0.41,
      "Precision_sd": 0.27,
      "Recall_mean": 0.6,
      "Recall_sd": 0.33,
      "F1_mean": 0.48,
      "F1_sd": 0.29
    },
    {
      "Ablated_Module": "Attention",
      "ACC_mean": 0.79,
      "ACC_sd": 0.04,
      "Precision_mean": 0.64,
      "Precision_sd": 0.03,
      "Recall_mean": 0.83,
      "Recall_sd": 0.13,
      "F1_mean": 0.72,
      "F1_sd": 0.04
    },
    {
      "Ablated_Module": "DWA",
      "ACC_mean": 0.79,
      "ACC_sd": 0.07,
      "Precision_mean": 0.41,
      "Precision_sd": 0.23,
      "Recall_mean": 0.77,
      "Recall_sd": 0.39,
      "F1_mean": 0.52,
      "F1_sd": 0.27
    }
  ],
  "table12_csnrac_thresholds": [
    {
      "Endpoints": "Mild Left",
      "Threshold": 3,
      "ACC": 0.565,
      "Precision": 0.556,
      "Recall": 0.852,
      "F1": 0.673,
      "PR_AUC": 0.546
    },
    {
      "Endpoints": "Mild Left",
      "Threshold": 4,
      "ACC": 0.545,
      "Precision": 0.537,
      "Recall": 0.765,
      "F1": 0.631,
      "PR_AUC": 0.475
    },
    {
      "Endpoints": "Mild Left",
      "Threshold": 5,
      "ACC": 0.587,
      "Precision": 0.568,
      "Recall": 0.857,
      "F1": 0.684,
      "PR_AUC": 0.541
    },
    {
      "Endpoints": "Mild Right",
      "Threshold": 8,
      "ACC": 0.537,
      "Precision": 1.0,
      "Recall": 0.05,
      "F1": 0.095,
      "PR_AUC": 0.471
    },
    {
      "Endpoints": "Mild Right",
      "Threshold": 9,
      "ACC": 0.542,
      "Precision": 0.529,
      "Recall": 0.75,
      "F1": 0.621,
      "PR_AUC": 0.374
    },
    {
      "Endpoints": "Mild Right",
      "Threshold": 10,
      "ACC": 0.6,
      "Precision": 0.0,
      "Recall": 0.0,
      "F1": 0.0,
      "PR_AUC": 0.572
    }
  ],
  "table13_transfer_validation": [
    {
      "Experiment": "Transfer Validation",
      "ACC_mean": 0.89,
      "ACC_sd": 0.02,
      "Precision_mean": 0.85,
      "Precision_sd": 0.04,
      "Recall_mean": 0.92,
      "Recall_sd": 0.0,
      "F1_mean": 0.89,
      "F1_sd": 0.03
    }
  ],
  "table15_bias_validation": [
    {
      "Experiment": "G-C (male)",
      "Accuracy_mean": 0.55,
      "Accuracy_sd": 0.19,
      "Precision_mean": 0.58,
      "Precision_sd": 0.16,
      "Recall_mean": 0.82,
      "Recall_sd": 0.49,
      "F1_mean": 0.68,
      "F1_sd": 0.25
    },
    {
      "Experiment": "G-C (female)",
      "Accuracy_mean": 0.83,
      "Accuracy_sd": 0.04,
      "Precision_mean": 0.67,
      "Precision_sd": 0.35,
      "Recall_mean": 0.52,
      "Recall_sd": 0.33,
      "F1_mean": 0.55,
      "F1_sd": 0.3
    },
    {
      "Experiment": "A-C",
      "Accuracy_mean": 0.7,
      "Accuracy_sd": 0.43,
      "Precision_mean": 0.67,
      "Precision_sd": 0.03,
      "Recall_mean": 0.73,
      "Recall_sd": 0.49,
      "F1_mean": 0.7,
      "F1_sd": 0.05
    }
  ]
};
