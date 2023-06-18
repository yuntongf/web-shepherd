import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import './index.css'
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
// import { Chroma } from "langchain/vectorstores/chroma";
// import { FaissStore } from "langchain/vectorstores/faiss";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import { OPENAI_API_KEY } from './config';

let response = "hello world!";
const root = ReactDOM.createRoot(document.getElementById('popup')!);

// global variables
let chain: any = null;
const msg = {
    from: "popup",
    to: "background"
}

chrome.runtime.sendMessage(msg);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.from === "background") {
            if (message.url === "") {
                root.render(
                    <div>Cannot index current page</div>
                );
            } else {
                indexWebPage(message.url).then(() => {
                    root.render(
                        <App response={`indexed ${message.url}`}/>
                    );
                });
            }
        }
    }
);

const indexWebPage = async (url: string) => {
    /* Initialize the LLM to use to answer the question */
    console.log("indexing web page")
    // load data
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    
    /* Create the vectorstore */
    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({openAIApiKey: OPENAI_API_KEY})
      );
    
    /* Create the chain */
    const model = new OpenAI({openAIApiKey: OPENAI_API_KEY, temperature: 0.0});
    chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        memory: new BufferMemory({
          memoryKey: "chat_history", // Must be set to "chat_history"
        }),
      }
    );
    console.log(docs);
}

// const run = async () => {
//     /* Ask it a question */
//     const question = "What did the president say about Justice Breyer?";
//     const res = await chain.call({ question });
//     console.log(res);
//     /* Ask it a follow up question */
//     const followUpRes = await chain.call({
//       question: "Was that nice?",
//     });
//     console.log(followUpRes);
//   };

root.render(
    <div>loading...</div>
);

