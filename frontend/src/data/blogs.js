// Blog posts, newest first. `content` is markdown (rendered with react-markdown).
// `slug` is the URL: /blogs/<slug>. Image paths point into /public.
// Images inside content: ![alt text](/blogs/<folder>/<file>) on its own line.
export const blogs = [
  {
    slug: "how-ai-remembers-you",
    title: "How AI Remembers About You",
    description:
      "LLMs are stateless, so how does ChatGPT know things about you? Short- vs long-term memory, episodic and semantic memory, Mem0 and knowledge graphs.",
    date: "2026-09-20",
    tags: ["AI", "AI Agent", "RAG", "Machine Learning", "Artificial Intelligence"],
    coverImage: "/blogs/blog-4/coverIMage.webp",
    content: `## Why LLMs Are Stateless

Before understanding why LLMs are stateless, let's understand what we mean by the term "stateless" here. Stateless here means LLMs do not have a persistent memory of their own. The API calls to LLMs are stateless, so if I ask any LLM what my name is, it won't give the correct answer because it doesn't really know it, unless I have already provided that information in the current conversation or the application has retrieved it from somewhere and included it in the prompt.

But that's not what happens in real life. ChatGPT does know things about me, right? So in this blog, we'll understand how that works.

LLMs are stateless because model parameters are frozen at inference. They hold patterns and knowledge learned during training, not information from your users or your personal data. The model doesn't automatically update its parameters every time you have a conversation with it.

Also, each LLM call starts fresh. The LLM receives tokens, processes them using attention, and produces an output. Then the call ends. Nothing automatically persists to the next call.

Of course, applications can send previous conversation history or other stored information along with the next request. This is what can make an LLM appear to remember something, even though the underlying model itself is not permanently storing that information from the conversation. To solve this problem, the concept of AI memory comes into the picture.

## What AI Memory Means

AI memory is nothing fancy. It simply means memory of the AI. But LLMs are stateless, so they don't have persistent memory of their own. What we do instead is add memory at the application level using databases and retrieval systems. Problem solved, right?

But no. If I store every memory in a database just like that, it can become messy. A lot of unnecessary information will get stored, and when we retrieve memories, things that are not needed may also get included. This can waste context space and make it harder for the LLM to focus on the information that actually matters. If the amount of retrieved information becomes too large or contains irrelevant or conflicting information, it can also make the model's response less reliable.

So, instead of storing and retrieving everything blindly, we need to organize memory. First of all, we can broadly divide memory into short-term memory and long-term memory.

## Short-Term Memory vs Long-Term Memory

To understand this concept in detail, we'll have to jump to biology. They say that to make a good LLM, make it mimic the human brain. So, try to think about how you remember things.

There are some things like things you own, the names of your friends, important dates, or other important facts that you remember for a long time. That's similar to long-term memory. On the other hand, there are some things like you have to go somewhere tomorrow, you have some work to complete, or something happened recently that you may only need to remember for a short period of time. As time passes, you may not need that information anymore. That's similar to short-term memory.

And that's how short-term and long-term memory can be understood in an AI application. **Short-term memory** generally contains information that is useful for the current conversation or task. For example, if you're planning a trip and you tell the AI that you're leaving on Friday and coming back on Sunday, that information is useful while planning the trip.

**Long-term memory** contains information that can remain useful across multiple conversations, such as your name, preferences, interests, or other information that doesn't change often. Moreover, long-term memory can be divided into different types, including factual memory and episodic memory.

![How an AI agent uses memory](/blogs/blog-4/howanAIAgentUsesMemory.webp)

## Episodic Memory for Past Experiences

To understand episodic memory, let's again go to our brain. Our brain stores special things or episodes, and we remember them for a long time. It can be something like your first project that gave you your first earning, a trip you took with your friends, or some important experience you had.

Similarly, here, episodic memory stores and retrieves specific past events or experiences, along with useful context about them. For example, let's say I made a finance tracker app in 2024 in Node.js using AI, but now I want to update it. If I give AI a prompt about what updates have to be done, it can retrieve the relevant episodic memory and understand that we are talking about the finance tracker app that was previously built in Node.js. Instead of starting from zero, the AI can use the information from that previous experience.

And if similar episodic memories keep appearing again and again, we can sometimes derive a more general fact or preference from them. For example, if I repeatedly build projects using JavaScript, React, and Node.js, the system may derive that JavaScript is one of my preferred technologies.

Long-term memory is essential for getting to know about user patterns. In real life, if you talk to any person every day, you start recognizing their patterns and preferences. Episodic memory can be used to make the user experience more personalized because the AI can remember relevant experiences from previous interactions.

The important thing to understand here is that episodic memory doesn't necessarily have to be immutable or append-only. A memory system may store an event and later update, summarize, merge, or remove information depending on how the application is designed. To retrieve these memories, we can use techniques such as retrieval-augmented generation, semantic search, metadata filtering, and time-based search.

## Semantic Memory for Facts and Knowledge

We have stored the information in our database now, but still, if I retrieve it all at once, it may fill up the context window. So here, we want to get the memory from the database according to what the user asked. And this is where retrieval comes into the picture.

For example, imagine the database contains information about the user's name, preferences, previous projects, travel history, and many other things. If the user asks something about their finance tracker, there is no reason to retrieve information about their previous trip. We only want the memories that are relevant to the current question.

This is similar to what RAG does. So, we can store vector embeddings of memories and then retrieve relevant memories according to the user's prompt using vector similarity search.

However, semantic memory and RAG are not exactly the same thing. Semantic memory refers to facts and knowledge, while RAG is a retrieval technique that can be used to retrieve relevant information and provide it to the LLM. For example, information such as your name, your preferences, or a fact about a previous project can be stored as semantic memory, and a retrieval system can find the relevant information when needed.

The basic idea is simple. Instead of giving the LLM everything stored in the database, we retrieve only the information that is relevant to the current request and provide that information to the LLM.

## How Memories Are Written, Updated and Forgotten

Now we know how memories can be stored and retrieved, but there is another important question. How does the AI decide what to remember in the first place?

We don't want to store every single thing the user says. For example, if I tell an AI, "I'm going to make coffee," there is probably no reason to permanently remember that. But if I say, "I'm vegetarian and allergic to nuts," that's useful information that could be relevant in future conversations.

So a memory system needs to identify information that is actually useful for future interactions. The application can analyze the conversation and extract useful information from it. If something is considered worth remembering, it can be stored as a memory.

But memories can also change. For example, if I previously told the AI that I'm vegetarian and later say that I have started eating chicken, the old memory may no longer be accurate. The system should therefore be able to update or replace the previous memory instead of blindly storing both pieces of information.

Then comes the final part, forgetting. Not everything needs to be remembered forever. For example, if I tell the AI that I have a meeting tomorrow at 10 AM, that information may be useful today, but after the meeting has happened, it may no longer be useful. A memory system can therefore remove, expire, merge, or stop retrieving memories that are no longer useful.

So memory is not simply about storing everything. It is about deciding what is useful to remember, storing it, retrieving it when needed, updating it when it changes, and forgetting it when it is no longer useful.

![The lifecycle of AI memory](/blogs/blog-4/TheLifecycleOfAIMemory.webp)

## Why Memory Is Different From the Context Window

A common confusion is that people think AI memory and the context window are the same thing, but they are not. The context window is the amount of information the LLM can process as part of a particular request.

Think of it like your desk. You may have a huge cupboard full of books and documents, but when you're working on one assignment, you only keep the books and papers you currently need on your desk. The cupboard is similar to your stored memory, while the desk is similar to the context window.

Your AI application can have a large amount of stored memory, but it doesn't need to send all of it to the LLM every time. Instead, it retrieves the relevant memories and puts only those memories into the context of the current request.

So, memory is information stored for future use, while the context window is the information currently provided to the model for a particular request. This distinction is important because memory can exist outside the LLM and outside the current context window.

![AI memory vs context window](/blogs/blog-4/aimemoryvscontextwindow.webp)

## Mem0 as a Memory System

Whatever we learnt so far, adding memory, updating memory, and retrieving memory accordingly, can be done using Mem0. Mem0 describes itself as a persistent memory infrastructure for AI agents. So instead of handling memory completely ourselves, Mem0 can help take care of the memory layer for our AI application. We can set up Mem0 using these simple steps:

\`\`\`js
// Step 1 — Install the SDK (run in your terminal, not in JS):
// npm install mem0ai

// Step 2 — Save as mem0_quickstart.mjs and run: node mem0_quickstart.mjs
//   (the .mjs extension enables ES modules + top-level await)
import { MemoryClient } from "mem0ai";

const client = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY ?? "your-api-key-here",
});

// Add a memory
const messages = [
  { role: "user", content: "I'm a vegetarian and allergic to nuts." },
  { role: "assistant", content: "Got it! I'll remember your dietary preferences." },
];
await client.add(messages, { user_id: "user123" });

// Search memories
const results = await client.search("What are my dietary restrictions?", {
  user_id: "user123",
});
console.log(results);
\`\`\`

The important part here isn't just the code. The idea is that we can add a memory from a conversation and later search for relevant memories when we need them. So instead of building the entire memory system ourselves, we can use a tool like Mem0 to handle parts of this process.

![An AI agent with memory and meaning: Mem0 and knowledge graphs](/blogs/blog-4/aiagentwithmemoryandmeaning.webp)

## Knowledge Graphs for Storing Connected Memories

We've made the memory system work, but let's think about making it better. Your mind doesn't just remember individual pieces of information. It also remembers relationships between things. For example, if someone gifted you a watch, whenever you see that watch, you may remember who gave it to you. The watch and the person who gave it to you are connected in your memory.

And that's exactly where we can use knowledge graphs or graph databases for storing connected memories. Instead of storing information as completely separate pieces, a knowledge graph can represent relationships between different pieces of information. For example, the system could understand that a particular project was built using Node.js and that the user prefers JavaScript.

This connected information can then be used to give the LLM extra and relevant context. This can result in better and more personalized responses, especially when the AI needs to understand relationships between users, projects, preferences, events, and other information.

## How Memory Can Make AI Agents More Useful

So far, we've mostly talked about AI remembering information. But memory becomes even more useful when we introduce AI agents. An AI agent can do more than just answer a question. It can use tools, perform tasks, work through multiple steps, and interact with different systems.

Now imagine an AI agent that helps you manage your projects. You previously told it that you were building a travel app using React and Node.js. A few days later, you tell it, "Add authentication to the project." Without memory, you may have to explain the project again. But with memory, the agent can retrieve the relevant information about the project and understand what you are referring to.

The same thing can happen with a personal assistant. Suppose you previously told your AI that you prefer budget-friendly hotels and usually travel by train. A few weeks later, you ask it to help plan a trip. The agent can retrieve those preferences and use them while planning.

Or imagine a coding agent that you use every day. Over time, it can remember the technologies you commonly work with, the kind of projects you build, and other useful preferences.

This is what makes memory powerful for AI agents. Without memory, every task can feel like a completely new conversation. With memory, the agent can use relevant information from previous interactions to understand what you're working on, what you prefer, what you've done before, and what you're trying to accomplish now.

Memory therefore helps AI agents maintain continuity across interactions and makes them more useful for tasks that require personalization, long-term context, and repeated interaction.
`,
  },
  {
    slug: "vectorless-rag",
    title: "RIP Vector RAG? An Introduction to Vectorless RAG",
    description:
      "Why chunk-and-embed retrieval loses context, and how Vectorless RAG (PageIndex trees and LLM-maintained wikis) retrieves information instead.",
    date: "2026-09-18",
    tags: ["RAG", "Vectorless RAG", "AI", "LLM"],
    coverImage: "/blogs/blog-3/coverImage.webp",
    content: `Before jumping on to Vectorless RAG and saying "RIP RAG", let's understand the problem with Normal RAG.

## Why traditional vector-based retrieval is not always enough

Picture it like this: *Swift is good and my favourite.* Now you must've imagined it to be either a Swift bird or a car, but if I tell you this is from a chapter in a book about birds, then you'll surely know that it is about the bird.

That's what the problem with RAG can be. While chunking the data, if we only care about character or token length, then a lot of times we can lose the context because information that belongs together can get split into different chunks. This problem can be thought of as **"Abrupt Chunking"**, and that is why we needed something better and with more context.

## What Vectorless RAG means

Before understanding Vectorless RAG, let's quickly recap a bit about Vector RAG. It chunked the data, then made vector embeddings of the data to store in a vector database and retrieved accordingly.

Vectorless RAG, as we can understand by the name, skips the vectorization process.

Which means no vector embeddings at all. Instead, some Vectorless RAG approaches create a tree-like structure to store information with the appropriate title, heading, or context.

## How Vectorless RAG retrieves information

Let's recap how Vector RAG worked. From all the vector embeddings, it chose the ones relevant to the current query.

But what Vectorless RAG does is eliminate the paths it doesn't need while traversing the tree and returns the relevant information.

The good thing about this retrieval process is that it remembers how it reached that particular information and has context about it.

![How Vectorless RAG retrieves information](/blogs/blog-3/howvectorlessragretrievesinfo.webp)

## PageIndex and document-level navigation

PageIndex generates a "Table of Contents" tree-structure index of documents and performs agentic reasoning-based retrieval through tree search.

![PageIndex-based retrieval](/blogs/blog-3/pageIndexbasedretrieval.webp)

## Using an LLM-generated Wiki for knowledge retrieval

For understanding the concept of LLM Wiki, let's start from the unit level.

For example, you have many data sources. Instead of using their vector embeddings or any other database, their Markdown files can be created and maintained by an LLM running in the background.

So what this LLM does is it creates folders accordingly for different types of data. For example, let's take the blog files on my computer which have the blogs. The background LLM will create a new folder for Markdown files of these blogs, and those Markdown files will be in a special format which is somewhat like:

\`\`\`markdown
# Title

**Summary**: One sentence describing this note.
**Tags**: #topic1 #topic2
**Created**: 2026-04-06T00:00:00+00:00
**Last Updated**: 2026-04-06T00:00:00+00:00

---

## Content

Write the main content here.

## Related Notes

- [[Note Title]]
\`\`\`

So now, if I ask a question about my RAG blog, the LLM can first look at the file names and look for files with relevant names. So for now, it gets rag.md.

Then it loads only the first 2 contents of the document, which have the information about the document content, and if those seem relevant, then the actual content in the Markdown file is loaded.

![LLM Wiki for knowledge retrieval](/blogs/blog-3/llmwikiforknowledgeretrieval.webp)

## Wiki as a memory layer for AI systems

Wiki is good not just for retrieval but even as a memory for AI systems.

In normal RAG architecture, you upload a collection of files, the LLM retrieves chunks at query time and generates an answer. It works, but for every question, the LLM has to rediscover the knowledge from scratch. There is no accumulation of data.

But in LLM Wiki, instead of just retrieving chunks at query time, it incrementally builds and maintains a persistent Wiki.

When a new source is added, the LLM reads it, extracts the information, and integrates it into the existing Wiki. It updates the content and summary in the Markdown file accordingly.

It is somewhat like if Instagram gets an update. You don't have to learn it again. You just update the information in your brain about the specific features that were updated.

## Vector RAG vs Vectorless RAG

![Vector RAG vs Vectorless RAG](/blogs/blog-3/vectorvsvectorlessrag.webp)

## Advantages and limitations of Vectorless RAG

### Advantages

- **Context-aware retrieval:** It can use the structure and context around information instead of treating every chunk as an isolated piece.
- **Better document understanding:** It can follow headings, sections, and relationships to reach the information it needs.
- **Knowledge can be updated:** In approaches like an LLM Wiki, new information can be added to the existing knowledge instead of rebuilding everything from scratch.
- **No vector database required:** Since it doesn't rely on vector embeddings, you can avoid the additional vector storage and retrieval layer.

### Limitations

- **Cost:** Building and maintaining the structure can require more LLM calls, which can increase the cost.
- **Takes time to process:** The system may need more processing during ingestion to understand and organize the information.
- **More complex to maintain:** As the amount of information grows, keeping the structure organized and up to date can become difficult.
- **Not ideal for every type of data:** If your data is highly unstructured, a simple vector search may sometimes be more practical.

## Hybrid strategies: when to combine both approaches

Now, does this mean we should completely replace Vector RAG with Vectorless RAG? Not necessarily. Think about it like finding a book in a huge library. Vector RAG is like quickly finding the books that are related to what you are looking for, while Vectorless RAG is like opening the right book and using its table of contents to navigate to the exact chapter and section you need.

We can combine both approaches too. Vector RAG can quickly narrow down the relevant documents, and then a structured or tree-based retrieval system can navigate through those documents to find the exact information.

So, instead of thinking that one approach has to replace the other, we can choose based on the type of data and the problem we are trying to solve. If you have lots of unstructured data where finding semantically similar information is the main goal, Vector RAG can be useful. But if your documents have a clear structure, headings, chapters, and relationships where context matters, Vectorless RAG can make more sense. And when you need both fast searching and structured context, a hybrid approach can give you the best of both worlds.
`,
  },
  {
    slug: "understanding-rag",
    title: "Understanding RAG: Why It Was Needed and How It Works",
    description:
      "Why LLMs need Retrieval-Augmented Generation, how indexing and retrieval work, and where RAG shines or falls short.",
    date: "2026-07-18",
    tags: ["RAG", "AI", "ML", "Technology", "Artificial Intelligence"],
    coverImage: "/blogs/blog-2/cover-image.webp",
    content: `Before understanding the fancy term RAG, let's first understand why it was needed.

## Limitations of LLMs

LLMs are trained on large amounts of publicly available data, licensed data, and data created by human trainers. So whenever I ask a question, they answer based on the knowledge they learned during training, not by searching the internet in real time.

New data is generated every day, and training frontier AI models is extremely expensive and time consuming, making it impractical to retrain them every day. Even if a company somehow retrained a model twice a day, it would still be missing any information created after the latest training run. Every AI model also has a knowledge cutoff date, the date of its most recent training.

> **Problem 1:** LLMs do not have access to data in real time.

Every company has confidential and private documents that aren't available on the internet. Companies generally do not train foundation models on confidential internal documents because of privacy, cost, and operational constraints. So if I work at that company and want to ask the model about, say, a specific invoice, it won't be able to tell me what items are on it, because it was never trained on that data — either now or in the future.

> **Problem 2:** I cannot ask questions about my own private data.

Now, a lot of people wonder: what if I provide that material by adding it to the system prompt, or providing it as context? Can the model answer based on those documents then?

The answer is yes, it can. But every AI model has a limited context window and a limited number of tokens, so this isn't efficient. Even with just 10 documents, if I paste the contents of those 10 PDFs into the system prompt, it's very likely the context window fills up. Feeding a large amount of data does not directly cause hallucinations. However, it can exceed the model's context window or dilute the most relevant information, increasing the chances of incomplete or inaccurate responses. And what if I have even more documents? That's where the problem lies.

This is where an optimal retrieval pipeline is needed.

## A Simple Analogy

Let's take a simple real-life example. Say you have to learn about data science and you go to a library. You first eliminate all the shelves with books unrelated to the topic, then pick up a few books from the data science shelf, check their indexes, find the page number for the information you need, and skip directly to that part.

Now let's apply the same idea here:

**Step 1 — Indexing:** Index the data so we can query it later. Indexing doesn't just mean storing data in a database; there's more to it. Think of it like a book with an index: first the book is written, then the index is created for easy navigation. So indexing is a way to store data so that it can be retrieved easily later.

**Step 2 — Retrieval:** The user's query is converted into an embedding and compared against the indexed embeddings to retrieve the most relevant chunks. When semantically similar chunks are found, they are retrieved and passed to the LLM along with the user prompt, and the user is finally answered based on the context of the indexed data.

And congratulations, what you just learned is RAG.

**RAG (Retrieval-Augmented Generation)** is a framework that improves the accuracy of an LLM by fetching facts from external data sources before generating a response.

![A simple RAG pipeline](/blogs/blog-2/simple-rag.webp)

## Where RAG Works Well

- **Customer support chatbots** — By indexing a company's files and documents, a chatbot can easily handle and answer customer queries.
- **Legal matters** — Legal textbooks are extensive, and learning the laws with the correct sections accurately is tough. We can simply index legal books and constitutions, which can be a great utility.
- **Education** — Each school or college uses different textbooks, and a single ML model can find it hard to give exact information — it often gives too little or overwhelms you with unnecessary information. With RAG this gets easier: upload your textbooks, they get indexed, and answers are retrieved directly from your books.
- And many more, like enterprise search, financial services, and healthcare.

## Where RAG Fails

RAG can do wonders, but it does fail sometimes. Let's understand when.

### Poor retrieval and missing context

You can think of retrieval like searching your own memory. If I ask you a question about something you've never heard of, your reply would simply be "Sorry, I don't know." If the required information is not present in the indexed documents, the model may either respond that it doesn't know, or attempt to generate an answer using its pre-trained knowledge, which may be incorrect.

![Good retrieval vs poor retrieval](/blogs/blog-2/goodretreivalvspoorretrieval.webp)

### Poor chunking

Chunking is the process of breaking large documents into smaller pieces (called chunks). Chunking is usually performed before embeddings are generated and stored in the vector database. If chunking is done poorly, it heavily affects the response. If chunks are too large, they occupy a larger portion of the context window, leaving less room for additional relevant information. If chunks are too small, they may not carry enough context, which can eventually lead to failure of RAG.

![Chunking comparison](/blogs/blog-2/chunkingcomparison.webp)

### Context window limitations

Every LLM has a context window: the maximum amount of text it can process in a single request. In a RAG system, this context includes the user's query, the system prompt, conversation history, and all retrieved documents. Since this space is limited, not every relevant document can always be included. When the retrieved content exceeds the model's context window, some information must be discarded or truncated. If the omitted content contains important details, the model may generate incomplete, inaccurate, or misleading responses.

![Context window limitation](/blogs/blog-2/contextwindowlimitation.webp)

### Hallucination with RAG

One of the primary reasons for using RAG is to reduce hallucinations. While RAG significantly reduces them by grounding the model's responses in retrieved documents, it does not guarantee factual accuracy. The LLM is still a generative model, meaning it predicts the most likely response based on both the retrieved context and its pre-trained knowledge. For example, hallucinations can occur when there is incomplete retrieval, ambiguous or vague user queries, conflicting documents, or weak prompt instructions.

### Outdated knowledge bases

A RAG system is only as reliable as the knowledge base it retrieves from. If the underlying documents are outdated, incomplete, or missing recent updates, the retrieval system will continue to return obsolete information if the vector index is not updated after the documents change. Consequently, even if the LLM accurately summarizes the retrieved content, the final response will still be incorrect because the source itself is outdated.

## When RAG Is Not the Right Solution

Although RAG is a powerful technique for answering questions based on external knowledge, it is not the best solution for every AI task. RAG is most effective when the answer depends on retrieving factual or domain-specific information from documents. If retrieval is unnecessary, adding a RAG pipeline only increases complexity, latency, and cost without improving response quality. A few scenarios where RAG is not useful include pure reasoning tasks, mathematical computation, creative writing, stable domain knowledge, and many more.

## Conclusion

RAG is a powerful approach for grounding AI responses in external knowledge, making it ideal for applications that rely on accurate, up-to-date, and domain-specific information. However, its effectiveness depends on high-quality retrieval, proper document chunking, an up-to-date knowledge base, and careful management of the model's context window. Understanding these limitations helps developers design more reliable RAG systems and recognize when a standard LLM may be the more suitable choice.
`,
  },
  {
    slug: "how-chatgpt-works",
    title: "Understanding How ChatGPT Works: From LLMs to Transformers",
    description:
      "What actually happens when you send ChatGPT a message: LLMs, tokenization and Transformers, explained from the basics.",
    date: "2026-07-01",
    tags: ["AI", "ChatGPT", "LLM", "Programming", "Artificial Intelligence"],
    coverImage: "/blogs/blog-1/cover-image.webp",
    content: `Before learning how ChatGPT understands questions, let's start from the basics so that we can understand it better.

## What is an LLM?

LLM stands for Large Language Model, which is basically an AI model trained on a massive amount of data. LLMs can solve problems as simple as writing and grammar, translation, intermediate problems like information retrieval and data organization, and really advanced problems like code generation and agentic workflows.

Some famous LLMs are GPT, Claude Opus, Gemini 1.5, Gemini 2.5, etc.

![Popular LLMs](/blogs/blog-1/popular-llms.webp)

LLMs have also inculcated themselves into our daily lives, and their applications include chatbots, coding assistants, writing emails, customer support, and many more.

## What Happens When You Send a Message to ChatGPT?

Now let's understand what happens when you send a message to ChatGPT.

For using ChatGPT or any AI, the first step a user does is type a prompt. Now comes the part that ChatGPT handles. The prompt is then broken into small pieces called tokens. Tokens are then converted into token IDs, then into embeddings before being processed.

The model does not predict the whole response at once. Instead, it predicts a probability distribution over the next token and then selects one based on decoding settings, one by one, until the answer is complete.

A small doubt that comes to everyone's mind is where these responses come from. Are they from "the Internet"? The simple answer is: not every time. Instead, it uses patterns it learned during training to generate a new response accordingly and predicts the next word one by one.

## Why Can't AI Understand Human Language Directly?

While explaining how ChatGPT works, I mentioned that it converts text into numbers. A question that comes to people's minds is: why can't AI simply understand human language?

Let's try to understand it with an example:

> "He slept on the bunk bed after he did a school bunk."

For us, we understand the context of both meanings — how one is just a way to rest, while the other refers to skipping school. But for computers/LLMs, it's confusing because the sentence has the term "bunk" twice, but with different meanings. To eliminate this, we use tokenization and the Attention mechanism. Also, neural networks operate on numerical representations rather than raw text.

## What is Tokenization?

Now let's understand tokenization, the process of converting text into tokens, without which it would've been hard to make LLMs understand things.

![Words vs tokens](/blogs/blog-1/wordsvstokens.webp)

Tokens are nothing but small units of text that AI can process. A token doesn't necessarily mean a single character; it can be anything from a punctuation mark to a whole word.

Tokenization is needed because machines cannot read text directly. Tokens are assigned numerical IDs so algorithms can process and analyze language. Tokenization enables models to recognize context, generate human-like text, translate languages, and perform sentiment analysis. Also, sub-word tokenization prevents the model from getting stuck on rare or misspelled words by breaking them into familiar, manageable chunks.

## What is a Transformer?

After tokenization, the magic that happens behind the scenes is done using a Transformer — not the one used to change voltage, but the one having enough power to answer almost anything.

A Transformer is nothing but a neural network architecture introduced in 2017 that revolutionized how AI understands language. Transformers revolutionized the way AI models work. Earlier models processed text mostly one word after another, but Transformers can look at all relevant words in a sentence simultaneously, making them much better at understanding context.

![Transformer attention mechanism](/blogs/blog-1/transformerattentionmechanism.webp)

To understand language, Transformers use a mechanism called Attention, which helps the model determine which words are most important when predicting the next token.

Transformers' ability to learn context effectively, handle long documents, train efficiently on large datasets, and produce high-quality text are the reasons why almost every modern LLM uses Transformers.

## Complete LLM Workflow

![Complete LLM workflow](/blogs/blog-1/completellmworkflow.webp)
`,
  },
];
