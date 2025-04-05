---
layout: ../layouts/MarkdownLayout.astro
---

## Download Datasets with RClone

...

```bash
rclone config file
# usually something like:
# ~/.config/rclone/rclone.conf
```

```bash
# ~/.config/rclone/rclone.conf
[r2-faithcopilot]
type = s3
provider = Cloudflare
acl = private
# provided at onboarding
access_key_id = abc123
secret_access_key = xyz456
endpoint = https://<accountid>.r2.cloudflarestorage.com
```

## Host Datasets on Huggingface 🤗 Hub

...

```python
import os
import json
import pandas as pd
from datasets import Dataset
from huggingface_hub import login

directory = "your-dataset/" 
dict_list = []
for filename in os.listdir(directory):
  if filename.endswith(".json"):
    file_path = os.path.join(directory, filename)
    with open(file_path, 'r') as file:
      data = json.load(file)
      dict_list.append(data)

df = pd.DataFrame(dict_list)
#print(df)
dataset = Dataset.from_pandas(df)
#print(dataset)
#print(dataset.data.nbytes)

login()
dataset.push_to_hub("your-repo/your-dataset")
```

## (SFT) Supervised Fine-Tuning

If you have a dataset hosted on HF Hub (see "Host Datasets on Huggingface 🤗 Hub"), you can easily fine-tune your SFT model using [SFTTrainer](https://huggingface.co/docs/trl/main/en/sft_trainer) from [TRL](https://huggingface.co/docs/trl/index)

```python
from datasets import load_dataset
from trl import SFTTrainer
...
# load jsonl dataset
dataset = load_dataset("json", data_files="path/to/dataset.jsonl", split="train")
# load dataset from the HuggingFace Hub
dataset = load_dataset("philschmid/dolly-15k-oai-style", split="train")
...
trainer = SFTTrainer(
    "facebook/opt-350m",
    args=training_args,
    train_dataset=dataset,
    packing=True,
)
```

## (DPO) Direct Preference Optimization

[TRL](https://huggingface.co/docs/trl/index) supports the [DPO Trainer](http://localhost:4321/docs#) for training language models from preference data, as described in the paper ["Direct Preference Optimization: Your Language Model is Secretly a Reward Model"](https://arxiv.org/abs/2305.18290) by Rafailov et al., 2023

```python
 dpo_trainer = DPOTrainer(
    model,
    model_ref,
    args=training_args,
    beta=0.1,
    train_dataset=train_dataset,
    tokenizer=tokenizer,
)
dpo_trainer.train()
```
