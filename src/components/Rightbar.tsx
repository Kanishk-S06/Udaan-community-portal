import Avatar from "react-avatar";
import account from "../assets/account.png";
import { auth, storage } from "../firebase/setup";
import question from "../assets/question.png";
import pen from "../assets/pen.png";
import edit from "../assets/edit.png";
import comment from "../assets/comment.png";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import PostPopup from "./PostPopup";

type searchProp = {
  search: any;
  menu: any;
};

const Rightbar = (props: searchProp) => {
  const questionRef = collection(storage, "questions");
  const [questionData, setQuestionData] = useState<any>([]);
  const [commentToggle, setCommentToggle] = useState<string | null>(null); // To track which question's comments are open
  const [questionId, setQuestionId] = useState("");
  const [answers, setAnswers] = useState("");
  const [post, setPost] = useState(false);
  const [answerData, setAnswerData] = useState<any>([]);

  const getQuestion = async () => {
    try {
      const data = await getDocs(questionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQuestionData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const getAnswers = async (questionId: string) => {
    try {
      const answerDoc = doc(storage, "questions", questionId);
      const answerRef = collection(answerDoc, "answers");
      const data = await getDocs(answerRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAnswerData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const addAnswer = async (questionId: string) => {
    try {
      const answerDoc = doc(storage, "questions", questionId);
      const answerRef = collection(answerDoc, "answers");
      await addDoc(answerRef, {
        ans: answers,
        email: auth?.currentUser?.email,
      });
      setAnswers(""); // Clear input after adding the answer
      getAnswers(questionId); // Refresh comments after adding a new one
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <div className="p-2 rounded-sm">
      <div className="bg-white p-2 h-20 border border-spacing-1">
        <div className="flex">
          {auth?.currentUser?.emailVerified ? (
            <Avatar
              round
              size="25"
              className="mt-0.5 ml-1 cursor-pointer"
              name={auth?.currentUser?.email ?? account}
              color="#1D4ED8"
            />
          ) : (
            <Avatar
              round
              size="25"
              className="mt-0.5 ml-1 cursor-pointer"
              src={account}
              color="#1D4ED8"
            />
          )}
          <input
            onClick={() => setPost(true)}
            placeholder="What do you want to ask or share?"
            className="bg-zinc-100 
      p-1 ml-4 placeholder-gray-600 border border-spacing-1 rounded-full w-full cursor-pointer"
          />
        </div>
        <div className="flex pt-2">
          <div onClick={() => setPost(true)} className="ml-16 flex cursor-pointer">
            <img src={question} className="w-5 h-5" />
            <h1 className="ml-2 text-sm">Ask</h1>
          </div>
          <h1 className="ml-20">|</h1>
          <div className="ml-16 flex">
            <img src={edit} className="w-5 h-5" />
            <h1 className="ml-2 text-sm">Answer</h1>
          </div>
          <h1 className="ml-20">|</h1>
          <div onClick={() => setPost(true)} className="ml-16 flex cursor-pointer">
            <img src={pen} className="w-5 h-5" />
            <h1 className="ml-2 text-sm">Post</h1>
          </div>
        </div>
      </div>

      {questionData
        .filter((data: any) =>
          props?.search
            ? data?.question.includes(props?.search)
            : data?.question?.includes(props?.menu)
        )
        .map((data: any) => {
          return (
            <>
              <div className="bg-white mt-2 p-2">
                <div className="flex">
                  {auth?.currentUser?.emailVerified ? (
                    <Avatar
                      round
                      size="25"
                      className="mt-0.5 ml-1 cursor-pointer"
                      name={data?.email ?? account}
                      color="#1D4ED8"
                    />
                  ) : (
                    <Avatar
                      round
                      size="25"
                      className="mt-0.5 ml-1 cursor-pointer"
                      src={account}
                      color="#1D4ED8"
                    />
                  )}
                  <h1 className="ml-3 font-bold">
                    {data?.email.substring(0, data.email.indexOf("@"))}
                  </h1>
                </div>
                <h1 className="mt-4 ml-2 font-bold">{data?.question}?</h1>
                <hr className="mt-3" />
                <div className="flex">
                  <img
                    src={comment}
                    onClick={() => {
                      setQuestionId(data?.id);
                      setCommentToggle(data?.id === commentToggle ? null : data?.id);
                      getAnswers(data?.id); // Fetch comments (answers)
                    }}
                    className="w-5 h-5 mt-3 cursor-pointer ml-3"
                  />
                  <button className="border border-spacing-1 p-1 mt-2 rounded-full ml-3">
                    Answers
                  </button>
                </div>

                {/* Show comments (answers) when commentToggle matches the question ID */}
                {commentToggle === data?.id && (
                  <>
                    <div className="mt-3">
                      {answerData.length > 0 ? (
                        answerData.map((answer: any) => (
                          <div key={answer.id} className="bg-gray-100 p-2 rounded-lg mt-2">
                            <p className="font-bold">{answer.email}</p>
                            <p>{answer.ans}</p>
                          </div>
                        ))
                      ) : (
                        <p>No answers yet.</p>
                      )}
                    </div>
                    <div className="flex mt-3">
                      {auth?.currentUser?.emailVerified ? (
                        <Avatar
                          round
                          size="35"
                          className="mt-0.5 ml-1 cursor-pointer"
                          name={auth?.currentUser?.email ?? account}
                          color="#1D4ED8"
                        />
                      ) : (
                        <Avatar
                          round
                          size="25"
                          className="mt-0.5 ml-1 cursor-pointer"
                          src={account}
                        />
                      )}
                      <input
                        value={answers}
                        onChange={(e) => setAnswers(e.target.value)}
                        placeholder="Add a comment"
                        className="bg-zinc-100 
                      p-1 ml-4 placeholder-gray-600 border border-spacing-1 rounded-full w-full h-10"
                      />
                      <button
                        onClick={() => {
                          addAnswer(data?.id);
                          // setCommentToggle(false);
                        }}
                        className="bg-blue-500 text-white rounded-full p-2 w-60 ml-3"
                      >
                        Add comment
                      </button>
                    </div>
                  </>
                )}

                <hr className="mt-4" />
              </div>
            </>
          );
        })}

      {post && <PostPopup setPost={setPost} />}
    </div>
  );
};

export default Rightbar;
