import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { red } from '@mui/material/colors';
import { Paper, Card } from "@mui/material";
import { Avatar} from '@mui/material';
import {Stack} from '@mui/material';
import shepherd from '../public/shepherd.jpg';
import { Dot } from 'react-animated-dots';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HistoryIcon from '@mui/icons-material/History';

/*********************************** Input Box *************************************/


interface IInputBoxType {
  query: string,
  setQuery: (query: string) => void,
  submitQuery: () => void
}
function InputBox({query, setQuery, submitQuery}: IInputBoxType) {
    const handleKeyDown = (key: string) => {
      if (key === 'Enter') {
        submitQuery();
      }
    }

    return (
        <TextField 
          className="mt-1 mb-2"
          value={query} 
          onChange={(e: any) => setQuery(e.target.value)} 
          onKeyDown={(e: any) => handleKeyDown(e.key)}
          style={{width:'98%', boxShadow:'10px'}}
          size="small"
          // variant="standard"
          // multiline
          // focused
          InputProps={{
            endAdornment: 
            <InputAdornment position="end">
              <IconButton
                aria-label="ask question"
                onClick={submitQuery}
                edge="end"
              >
                <SendIcon/>
              </IconButton>
            </InputAdornment>
          }}
        />
    )
}

/*********************************** Question & Response *************************************/
const avatar_size = 32

interface IQuestion {
  question: string
}
function Question({question}: IQuestion) {
  return (
      <div className="d-flex justify-content-end mb-2">
          <div className="d-flex">
              <div className="" style={{maxWidth: '90%'}}>
                  <Paper 
                    className="ps-2 pe-2 pt-1 pb-1 ms-2 me-2" 
                    elevation={0} 
                    style={{textAlign: 'left'}}>
                      {question}
                  </Paper>
              </div>
              <h3 className="">
                  <Avatar src={""} sx={{width: avatar_size, height: avatar_size}}/>
              </h3>
          </div>
      </div>
  )
}
interface IResponse {
  response: string
}
function Response({response}: IResponse) {
  return (
      <div className="d-flex mb-2">
          <h3>
              <Avatar src={'./shepherd_large.png'} sx={{width: avatar_size, height: avatar_size}}/>
          </h3>
          <div style={{maxWidth: '90%'}}>
            {response === "" ? 
              <span className="mt-0 mb-0" style={{fontSize: '160%'}}>
                <Dot>.</Dot>
                <Dot>.</Dot>
                <Dot>.</Dot>
              </span>
              :
              <Paper 
                // variant="outlined"
                className="ps-2 pe-2 pt-1 pb-1 ms-2 me-2" 
                elevation={0} 
                style={{textAlign: 'left'}}>
                  {response}
              </Paper>
            }
          </div>
      </div>
  )
}

/*********************************** Dialogues *************************************/
interface IDialogues {
  dialogues: {
    question: string,
    response: string
  }[],
  showHistory: boolean,
  collapsed: boolean
}

function Dialogues({dialogues, showHistory, collapsed}: IDialogues) {
  // const collapsedStyle = {width: '100%', height: '35px', overflow: 'hidden'};
  const expandedStyle = {width: '100%', maxHeight: '400px', minHeight:'40px', height: '400px', overflow: 'hidden'};
  return (
    <div style={expandedStyle}> 
      <div style={{ 
        overflowY: 'scroll', 
        width: '100%', 
        height: '100%', 
        paddingRight: '17px', 
        boxSizing: 'content-box'}}>
            <Response response={'Hi there! How can I help you?'}/>
            {!collapsed && showHistory && dialogues.map((dialogue, i) => 
            <div>
                <Question question={dialogue.question} />
                <Response response={dialogue.response}/>
            </div>)}
            {!collapsed && !showHistory && dialogues.length > 0 && <div>
                <Question question={dialogues[dialogues.length - 1].question} />
                <Response response={dialogues[dialogues.length - 1].response}/>
            </div>}
          {/* <div className="d-flex justify-content-center">
              {dialogue.response && 
              showFeedbackIcons && 
              <Feedback dialogue={dialogue}/>}
          </div> */}
      </div>
    </div>
  )
}


/*********************************** App *************************************/
const backgroundColor = '#fef9f3';

interface IAppProps {
  chain: any
}
const App: React.FC<IAppProps> = ({chain}: IAppProps) => {
  const [query, setQuery] = useState("");
  const [dialogues, setDialogues] = useState<{ question: string; response: string;}[] | never[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  // const [response, setResponse] = useState("");
  // useEffect(() => {
  //   let newDialogue = {
  //     question: query,
  //     response: response
  //   }
  //   console.log(newDialogue.response);
  //   setDialogues([...dialogues.slice(0, dialogues.length - 1), newDialogue])
  // }, [response]);

  const run = async (query: string) => {
    /* Ask it a question */
    try {
      const res = await chain.call({question: query});
      return res.text;
    } catch (e: any) {
      console.log(e);
      return `I'm sorry there has been an error: ${e}`
    }
  };

  const submitQuery = async () => {
    if (query) {
      /* post question */ 
      let newDialogue = {
        question: query,
        response: ""
      }
      setDialogues([...dialogues, newDialogue]);

      run(query)
      .then((res) => {
        newDialogue.response = res;
        setDialogues([...dialogues, newDialogue])
      })
      .catch((error: any) => {
        console.error(error);
      });
      setQuery('');
    }
  }

  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
            {/* {collapsed ? <ExpandMoreIcon color='action' onClick={() => setCollapsed(!collapsed)}/> 
            : <ExpandLessIcon color='action' onClick={() => setCollapsed(!collapsed)}/>} */}
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
        <Dialogues dialogues={dialogues} showHistory={showHistory} collapsed={collapsed}/>
          <HistoryIcon color={showHistory ? 'primary' : 'action'} className='' onClick={() => setShowHistory(!showHistory)}/>
          <InputBox query={query} setQuery={setQuery} submitQuery={submitQuery} />
      </body>
    </div>
  );
}

const LoadPage: React.FC = () => {
  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
        <div style={{position: 'fixed', left: '20%', top: '40%'}}>
            loading current page
            <span className="mt-0 mb-0" style={{fontSize: '160%'}}>
                <Dot>🐕</Dot>
                <Dot>🐕</Dot>
                <Dot>🐕</Dot>
            </span>
        </div>
      </body>
    </div>
  )
}

const ErrorPage: React.FC = () => {
  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
        <div style={{position: 'fixed', left: '25%', top: '40%'}}>
            Please refresh current page 🐕
        </div>
      </body>
    </div>
  )
}

export {App, LoadPage, ErrorPage};
