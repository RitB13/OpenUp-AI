from sentence_transformers import SentenceTransformer, models, InputExample, losses
from torch.utils.data import DataLoader
import pandas as pd

# Load base model
model_name = "sentence-transformers/all-MiniLM-L6-v2"
word_embedding_model = models.Transformer(model_name)
pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())
model = SentenceTransformer(modules=[word_embedding_model, pooling_model])

# Load your data
df = pd.read_csv("embedding_training/wellness_pairs.csv")
train_examples = [InputExample(texts=[row['sentence1'], row['sentence2']]) for _, row in df.iterrows()]

train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
train_loss = losses.MultipleNegativesRankingLoss(model)

# Train
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=1, warmup_steps=10)

# Save
model.save("embedding_training/custom-wellness-embedder")
