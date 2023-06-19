import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { Paper, Card, Tooltip, CircularProgress } from "@mui/material";
import { Avatar} from '@mui/material';
import { Dot } from 'react-animated-dots';
import HistoryIcon from '@mui/icons-material/History';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

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

/*********************************** Settings & Entry Page *************************************/
function Statement() {
  return (
    <div className='mt-3 me-3' style={{fontSize: 14, color: 'GrayText'}}>
      <p className='text-decoration-none'>We respect your privary. Hence the above information will only be held securely on Chrome's 
        <a href="https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas">
          {` storage.session `}
        </a>
        until the browser is shut down.
      </p>

      <p className='text-decoration-none'>To create or delete a secret API key, please open the following link in a new tab:
        <a href="https://platform.openai.com/account/api-keys"> https://platform.openai.com/account/api-keys</a>
      </p> 
    </div>
  )
}

interface ISettings {
  setShowSettings: (a: boolean) => void
}
function Settings({setShowSettings}: ISettings) {
  const submitApiKey = () => {
    chrome.storage.session.set({ API_KEY: apiKey }).then(() => {
      const msg = {
        from: "popup",
        to: "background"
      }
      chrome.runtime.sendMessage(msg);
    });
  }

  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div>
        <ArrowBackIcon onClick={() => setShowSettings(false)}/>
        <div className='mt-3 mb-2'>
          <InputLabel htmlFor="api_key_input">Reset OpenAI API key</InputLabel>
          <TextField
            id="api_key_input"
            onChange={(e) => setApiKey(e.target.value)}
            variant='standard'
            style={{width: '80%'}}
            InputProps={{
              endAdornment: 
              <InputAdornment position="end">
                <IconButton
                  aria-label="ask question"
                  onClick={submitApiKey}
                  edge="end"
                >
                  <CheckIcon color={saved ? 'success' : 'action'} onClick={() => setSaved(true)}/>
                </IconButton>
              </InputAdornment>
            }}
          />
        </div>
        <Statement/>
    </div>
  )
}

const EntryPage: React.FC = () => {
  const submitApiKey = () => {
    chrome.storage.session.set({ API_KEY: apiKey }).then(() => {
      const msg = {
        from: "popup",
        to: "background"
      }
      chrome.runtime.sendMessage(msg);
    });
  }

  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
      <div className='mt-3 mb-2'>
        <InputLabel htmlFor="api_key_input">OpenAI API key</InputLabel>
        <TextField
          id="api_key_input"
          onChange={(e) => setApiKey(e.target.value)}
          variant='standard'
          style={{width: '80%'}}
          InputProps={{
            endAdornment: 
            <InputAdornment position="end">
              <IconButton
                aria-label="ask question"
                onClick={submitApiKey}
                edge="end"
              >
                {!saving ? 
                  <CheckIcon color='action' onClick={() => setSaving(true)}/>
                :
                  <CircularProgress size={20}/>
                }
              </IconButton>
            </InputAdornment>
          }}
        />
        <Statement/>
    </div>
      </body>
    </div>
  )
}


/*********************************** App *************************************/
const backgroundColor = '#fef9f3';

interface IAppProps {
  chain: any
}
const App: React.FC<IAppProps> = ({chain}: IAppProps) => {
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
      const res = await chain.call(
        {question: query});
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

  const [query, setQuery] = useState("");
  const [dialogues, setDialogues] = useState<{ question: string; response: string;}[] | never[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(chain == null);

  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
            {/* {collapsed ? <ExpandMoreIcon color='action' onClick={() => setCollapsed(!collapsed)}/> 
            : <ExpandLessIcon color='action' onClick={() => setCollapsed(!collapsed)}/>} */}
      </header>
      <body className="ps-3 pt-3 pe-3" style={{backgroundColor: backgroundColor}}>
          {showSettings ? 
          <Settings setShowSettings={setShowSettings}/>
          :
          <div>
            <Dialogues dialogues={dialogues} showHistory={showHistory} collapsed={collapsed}/>
            <Tooltip title={showHistory ? 'show last question' : 'show history'}>
              <HistoryIcon 
                color={showHistory ? 'primary' : 'action'} 
                onClick={() => setShowHistory(!showHistory)}/>
            </Tooltip>
            <SettingsIcon 
              onClick={() => setShowSettings(!showSettings)}
              color={showSettings ? 'primary' : 'action'}/>
            <InputBox query={query} setQuery={setQuery} submitQuery={submitQuery} />
          </div>}
      </body>
    </div>
  );
}

/*********************************** LoadPage *************************************/

const LoadPage: React.FC = () => {
  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
        <div style={{position: 'fixed', left: '23%', top: '40%'}}>
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

/*********************************** ErrorPage *************************************/

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



export {App, LoadPage, ErrorPage, EntryPage};
