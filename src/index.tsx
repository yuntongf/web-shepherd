import React from 'react';
import ReactDOM from "react-dom/client";
import {App, EntryPage, ErrorPage, LoadPage} from './App';
import './index.css'
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
// import { OPENAI_API_KEY } from './config';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// global variables
let chain: any = null;
let OPENAI_API_KEY = ""
const msg = {
    from: "popup",
    to: "background"
}

const root = ReactDOM.createRoot(document.getElementById('popup')!);

chrome.runtime.sendMessage(msg);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.from === "background") {
            if (message.url === "") {
                root.render(
                    <ErrorPage/>
                );
            } else {
                if (typeof message.API_KEY === 'undefined') {
                    root.render(
                        <EntryPage/>
                    );
                } else {
                    OPENAI_API_KEY = message.API_KEY;
                    indexWebPage(message.url).then(() => {
                    root.render(
                        <App chain={chain}/>
                    );
                });}
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
    const fasterModel = new OpenAI({openAIApiKey: OPENAI_API_KEY, modelName: "gpt-3.5-turbo", temperature: 0.0});
    chain = ConversationalRetrievalQAChain.fromLLM(
        fasterModel,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
        memory: new BufferMemory({
          memoryKey: "chat_history",
          inputKey: "question",
          outputKey: "text",
          returnMessages: true, 
        }),
        questionGeneratorChainOptions: {
          llm: fasterModel
        }
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

