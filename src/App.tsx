import { useState } from 'react';
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

function LoadingPage() {
  return (
    <div>
      Loading...
    </div>
  )
}
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
          className="mt-4"
          label='' 
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
        }}/>
    )
}

/*********************************** Question & Response *************************************/
const avatar_size = 32

interface IQuestion {
  question: string
}
function Question({question}: IQuestion) {
  return (
      <div className="d-flex justify-content-end">
          <div className="d-flex">
              <div className="">
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
      <div className="d-flex">
          <h3>
              <Avatar src={'./shepherd_large.png'} sx={{width: avatar_size, height: avatar_size}}/>
          </h3>
          <div style={{maxWidth: '85%'}}>
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

/*********************************** Dialogue *************************************/
interface IDialogues {
  dialogues: {
    question: string,
    response: string
  }[]
}

function Dialogues({dialogues}: IDialogues) {
  const spacing = 0.5;
  return (
    <div style={{width: '100%', maxHeight: '450px', height:'400px', overflow: 'hidden'}}> 
      <Stack style={{ overflowY: 'scroll', width: '100%', height: '100%', paddingRight: '17px', boxSizing: 'content-box'}} spacing={spacing}>
          <Response response={"Hi there! How can I help you?"}/>
          {dialogues.map((dialogue, i) => 
            <Stack spacing={spacing}>
                <Question question={dialogue.question}/>
                <Response response={dialogue.response}/>
            </Stack>
          )}
          {/* <div className="d-flex justify-content-center">
              {dialogue.response && 
              showFeedbackIcons && 
              <Feedback dialogue={dialogue}/>}
          </div> */}
      </Stack>
    </div>
  )
}


/*********************************** App *************************************/

interface IAppProps {
  run: (query: string) => Promise<any>
}
const App: React.FC<IAppProps> = ({run}: IAppProps) => {
  const [query, setQuery] = useState("");
  const [dialogues, setDialogues] = useState<{ question: string; response: string;}[] | never[]>([]);

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
  const backgroundColor = '#fef9f3';
  return (
    <div style={{backgroundColor: backgroundColor}}>
      <header>
      </header>
      <body className="ps-3 pt-3" style={{backgroundColor: backgroundColor}}>
        <Dialogues dialogues={dialogues}/>
        <InputBox query={query} setQuery={setQuery} submitQuery={submitQuery} />
      </body>
    </div>
  );
}

export default App;
