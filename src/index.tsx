import React from 'react';
import ReactDOM from "react-dom/client";
import {App, ErrorPage, LoadPage} from './App';
import './index.css'
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import { OPENAI_API_KEY } from './config';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

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
                    <ErrorPage/>
                );
            } else {
                indexWebPage(message.url).then(() => {
                    root.render(
                        <App chain={chain}/>
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

    /* split text */
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 3000,
        chunkOverlap: 1500,
      });

    const splittedDocs = await splitter.splitDocuments(docs);
    
    /* Create the vectorstore */
    const vectorStore = await MemoryVectorStore.fromDocuments(
        splittedDocs,
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


root.render(<LoadPage/>);

// indexWebPage("https://machine-learning-upenn.github.io/about/").then(() => {
//     root.render(
//         <App chain={chain}/>
//     );
// });

