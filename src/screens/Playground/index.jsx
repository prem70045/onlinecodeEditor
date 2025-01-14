
// // import React, { useContext, useState, useCallback } from 'react';
// // import EditorContainer from './EditorContainer';
// // import InputConsole from './InputConsole';
// // import OutputConsole from './OutputConsole';
// // import Navbar from './Navbar';
// // import styled from 'styled-components';
// // import { useParams } from 'react-router-dom';
// // import { languageMap, PlaygroundContext } from '../../context/PlaygroundContext';
// // import { ModalContext } from '../../context/ModalContext';
// // import Modal from '../../components/Modal';
// // import { Buffer } from 'buffer';
// // import axios from 'axios';

// // const MainContainer = styled.div`
// //   display: grid;
// //   grid-template-columns: ${({ isFullScreen }) => isFullScreen ? '1fr' : '2fr 1fr'};
// //   min-height: ${({ isFullScreen }) => isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};
// //   @media (max-width: 768px) {
// //     grid-template-columns: 1fr;
// //   }
// // `;

// // const Consoles = styled.div`
// //   display: grid;
// //   width: 100%;
// //   grid-template-rows: 1fr 1fr;
// //   grid-template-columns: 1fr;
// // `;

// // const Playground = () => {
// //   const { folderId, playgroundId } = useParams();
// //   const { folders, savePlayground } = useContext(PlaygroundContext);
// //   const { isOpenModal, openModal, closeModal } = useContext(ModalContext);
// //   const { title, language, code } = folders[folderId].playgrounds[playgroundId];

// //   const [currentLanguage, setCurrentLanguage] = useState(language);
// //   const [currentCode, setCurrentCode] = useState(code);
// //   const [currentInput, setCurrentInput] = useState('');
// //   const [currentOutput, setCurrentOutput] = useState('');
// //   const [isFullScreen, setIsFullScreen] = useState(false);

// //   // Memoized saveCode function to prevent unnecessary re-renders
// //   const saveCode = useCallback(() => {
// //     savePlayground(folderId, playgroundId, currentCode, currentLanguage);
// //   }, [currentCode, currentLanguage, folderId, playgroundId, savePlayground]);

// //   const encode = (str) => {
// //     return Buffer.from(str, 'binary').toString('base64');
// //   };

// //   const decode = (str) => {
// //     return Buffer.from(str, 'base64').toString();
// //   };

// //   const postSubmission = async (language_id, source_code, stdin) => {
// //     try {
// //       const options = {
// //         method: 'POST',
// //         url: 'https://judge0-ce.p.rapidapi.com/submissions',
// //         params: { base64_encoded: 'true', fields: '*' },
// //         headers: {
// //           'content-type': 'application/json',
// //           'X-RapidAPI-Key': 'b4e5c5a05fmsh9adf6ec091523f8p165338jsncc58f31c26e1',
// //           'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
// //         },
// //         data: JSON.stringify({
// //           language_id: language_id,
// //           source_code: source_code,
// //           stdin: stdin,
// //         }),
// //       };

// //       const res = await axios.request(options);
// //       return res.data.token;
// //     } catch (error) {
// //       console.error('Error submitting code:', error);
// //       setCurrentOutput('Error submitting code');
// //     }
// //   };

// //   const getOutput = async (token) => {
// //     try {
// //       let attempts = 0;
// //       let res = null;
// //       while (attempts < 5) {
// //         const options = {
// //           method: 'GET',
// //           url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
// //           params: { base64_encoded: 'true', fields: '*' },
// //           headers: {
// //             'X-RapidAPI-Key': '3ed7a75b44mshc9e28568fe0317bp17b5b2jsn6d89943165d8',
// //             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
// //           },
// //         };

// //         res = await axios.request(options);

// //         if (res.data.status_id > 2) {
// //           break; // Exit if the status is complete
// //         }

// //         attempts += 1;
// //         await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry after 2 seconds
// //       }
// //       return res.data;
// //     } catch (error) {
// //       console.error('Error getting output:', error);
// //       return null;
// //     }
// //   };

// //   const runCode = async () => {
// //     if (!currentCode.trim()) {
// //       alert('Please write some code before running.');
// //       return;
// //     }
// //     if (!currentInput.trim()) {
// //       alert('Please provide some input.');
// //       return;
// //     }

// //     openModal({
// //       show: true,
// //       modalType: 6,
// //       identifiers: {
// //         folderId: '',
// //         cardId: '',
// //       },
// //     });

// //     try {
// //       const language_id = languageMap[currentLanguage].id;
// //       const source_code = encode(currentCode);
// //       const stdin = encode(currentInput);

// //       // pass these things to Create Submissions
// //       const token = await postSubmission(language_id, source_code, stdin);

// //       // get the output
// //       const res = await getOutput(token);
// //       if (!res) {
// //         setCurrentOutput('Error fetching output.');
// //         return;
// //       }

// //       const status_name = res.status.description;
// //       const decoded_output = decode(res.stdout || '');
// //       const decoded_compile_output = decode(res.compile_output || '');
// //       const decoded_error = decode(res.stderr || '');

// //       let final_output = '';
// //       if (res.status_id !== 3) {
// //         final_output = decoded_compile_output === '' ? decoded_error : decoded_compile_output;
// //       } else {
// //         final_output = decoded_output;
// //       }

// //       setCurrentOutput(`${status_name}\n\n${final_output}`);
// //     } catch (error) {
// //       console.error('Error running code:', error);
// //       setCurrentOutput('An error occurred while running the code.');
// //     } finally {
// //       closeModal();
// //     }
// //   };

// //   const getFile = (e, setState) => {
// //     const input = e.target;
// //     if ('files' in input && input.files.length > 0) {
// //       placeFileContent(input.files[0], setState);
// //     }
// //   };

// //   const placeFileContent = (file, setState) => {
// //     readFileContent(file)
// //       .then((content) => {
// //         setState(content);
// //       })
// //       .catch((error) => console.log(error));
// //   };

// //   function readFileContent(file) {
// //     const reader = new FileReader();
// //     return new Promise((resolve, reject) => {
// //       reader.onload = (event) => resolve(event.target.result);
// //       reader.onerror = (error) => reject(error);
// //       reader.readAsText(file);
// //     });
// //   }

// //   return (
// //     <div>
// //       <Navbar isFullScreen={isFullScreen} />
// //       <MainContainer isFullScreen={isFullScreen}>
// //         <EditorContainer
// //           title={title}
// //           currentLanguage={currentLanguage}
// //           setCurrentLanguage={setCurrentLanguage}
// //           currentCode={currentCode}
// //           setCurrentCode={setCurrentCode}
// //           folderId={folderId}
// //           playgroundId={playgroundId}
// //           saveCode={saveCode}
// //           runCode={runCode}
// //           getFile={getFile}
// //           isFullScreen={isFullScreen}
// //           setIsFullScreen={setIsFullScreen}
// //         />
// //         <Consoles>
// //           <InputConsole
// //             currentInput={currentInput}
// //             setCurrentInput={setCurrentInput}
// //             getFile={getFile}
// //           />
// //           <OutputConsole currentOutput={currentOutput} />
// //         </Consoles>
// //       </MainContainer>
// //       {isOpenModal.show && <Modal />}
// //     </div>
// //   );
// // };

// // export default Playground;

import React, { useContext, useState, useEffect } from 'react';
import EditorContainer from './EditorContainer';
import InputConsole from './InputConsole';
import OutputConsole from './OutputConsole';
import Navbar from './Navbar';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { languageMap, PlaygroundContext } from '../../context/PlaygroundContext';
import { ModalContext } from '../../context/ModalContext';
import Modal from '../../components/Modal';
import { Buffer } from 'buffer';
import axios from 'axios';

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) => isFullScreen ? '1fr' : '2fr 1fr'};
  min-height: ${({ isFullScreen }) => isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Consoles = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
`;

const Playground = () => {
  const { folderId, playgroundId } = useParams();
  const { folders, savePlayground } = useContext(PlaygroundContext);
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext);

  const [currentLanguage, setCurrentLanguage] = useState(null); // Initially set as null
  const [currentCode, setCurrentCode] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState(''); // Set title state

  // Get folder and playground
  const folder = folders?.[folderId];
  const playground = folder?.playgrounds?.[playgroundId];

  // Handle conditionally render when folder or playground is missing
  useEffect(() => {
    if (!folder || !playground) {
      setCurrentOutput('Error: Folder or Playground not found.');
      return;
    }

    setCurrentLanguage(playground.language);
    setCurrentCode(playground.code);
    setTitle(playground.title); // Set the title from the playground object
  }, [folder, playground]); // Depend on folder and playground

  const saveCode = () => {
    savePlayground(folderId, playgroundId, currentCode, currentLanguage);
  };

  const encode = (str) => {
    return Buffer.from(str, 'binary').toString('base64');
  };

  const decode = (str) => {
    return Buffer.from(str, 'base64').toString();
  };

  const postSubmission = async (language_id, source_code, stdin) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b4e5c5a05fmsh9adf6ec091523f8p165338jsncc58f31c26e1',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        data: JSON.stringify({
          language_id: language_id,
          source_code: source_code,
          stdin: stdin,
        }),
      };

      const res = await axios.request(options);
      return res.data.token;
    } catch (error) {
      console.error('Error submitting code:', error);
      setCurrentOutput('Error submitting code');
    }
  };

  const getOutput = async (token) => {
    try {
      let attempts = 0;
      let res = null;
      while (attempts < 5) {
        const options = {
          method: 'GET',
          url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          params: { base64_encoded: 'true', fields: '*' },
          headers: {
            'X-RapidAPI-Key': '3ed7a75b44mshc9e28568fe0317bp17b5b2jsn6d89943165d8',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        };

        res = await axios.request(options);

        if (res.data.status_id > 2) {
          break; // Exit if the status is complete
        }

        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry after 2 seconds
      }
      return res.data;
    } catch (error) {
      console.error('Error getting output:', error);
      return null;
    }
  };

  const runCode = async () => {
    if (!currentCode.trim()) {
      alert('Please write some code before running.');
      return;
    }
    if (!currentInput.trim()) {
      alert('Please provide some input.');
      return;
    }

    openModal({
      show: true,
      modalType: 6,
      identifiers: {
        folderId: '',
        cardId: '',
      },
    });

    try {
      const language_id = languageMap[currentLanguage].id;
      const source_code = encode(currentCode);
      const stdin = encode(currentInput);

      // pass these things to Create Submissions
      const token = await postSubmission(language_id, source_code, stdin);

      // get the output
      const res = await getOutput(token);
      if (!res) {
        setCurrentOutput('Error fetching output.');
        return;
      }

      const status_name = res.status.description;
      const decoded_output = decode(res.stdout || '');
      const decoded_compile_output = decode(res.compile_output || '');
      const decoded_error = decode(res.stderr || '');

      let final_output = '';
      if (res.status_id !== 3) {
        final_output = decoded_compile_output === '' ? decoded_error : decoded_compile_output;
      } else {
        final_output = decoded_output;
      }

      setCurrentOutput(`${status_name}\n\n${final_output}`);
    } catch (error) {
      console.error('Error running code:', error);
      setCurrentOutput('An error occurred while running the code.');
    } finally {
      closeModal();
    }
  };

  const getFile = (e, setState) => {
    const input = e.target;
    if ('files' in input && input.files.length > 0) {
      placeFileContent(input.files[0], setState);
    }
  };

  const placeFileContent = (file, setState) => {
    readFileContent(file)
      .then((content) => {
        setState(content);
      })
      .catch((error) => console.log(error));
  };

  function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  return (
    <div>
      <Navbar isFullScreen={isFullScreen} />
      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title} // title is now defined
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={saveCode}
          runCode={runCode}
          getFile={getFile}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <Consoles>
          <InputConsole
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            getFile={getFile}
          />
          <OutputConsole currentOutput={currentOutput} />
        </Consoles>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </div>
  );
};

export default Playground;
