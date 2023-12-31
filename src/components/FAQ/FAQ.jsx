import "./FAQ.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";

const FAQ = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [word, setWord] = useState("");
  const [comment, setComment] = useState("");
  const [faqItems, setFaqItems] = useState([]);
  const [formError, setFormError] = useState("");
  const [showActions, setShowActions] = useState(false);

  const [faqData, setFaqData] = useState({
    questionL: "",
    questionK: "",
    answerL: "",
    answerK: "",
  });

  const handleFormSubmitFaq = async (event) => {
    event.preventDefault();

    const storedToken = localStorage.getItem("authToken");
    const { questionL, questionK, answerL, answerK } = faqData;

    // Check if any input length is 0
    if (questionL.length === 0 || questionK.length === 0 || answerL.length === 0 || answerK.length === 0) {
      setFormError("Barcha malumotlarni to'ldirish shart ?!.");
      return;
    }
    const response = await fetch("http://188.225.10.97:8080/api/v1/faq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        questionL,
        questionK,
        answerL,
        answerK,
      }),
    });
    try {
      const responseData = await response.json();
      setFaqItems((prevFaqItems) => [...prevFaqItems, responseData]);
      console.log(responseData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Handle the error appropriately
    }

    fetchDataFaq();
    setFormError("");
    closeModal();
  };

  const fetchDataFaq = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch("http://188.225.10.97:8080/api/v1/faq/all", {
        method: "GET", // GET method
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setFaqItems(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDataFaq();
  }, []);

  const handleDeleteClick = async (faqItemId) => {
    const storedToken = localStorage.getItem("authToken");
    await fetch(`http://188.225.10.97:8080/api/v1/faq/${faqItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    setFaqItems((prevFaqItems) =>
      prevFaqItems.filter((item) => item.id !== faqItemId)
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setWord("");
    setComment("");
  };

  const handleActionsClick = (index) => {
    setShowActions((prevShowActions) =>
      prevShowActions === index ? null : index
    );
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="news-title">FAQ</h1>
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>
      {faqItems.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}

      <Modal
        isOpen={isModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Bo’lim qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitFaq}>
            <h2 className="form-error">{formError}</h2>

            <label htmlFor="adminName">Yangilik nomi</label>
            <input
              className="adminName"
              type="text"
              id="adminName"
              name="fullName"
              autoComplete="off"
              placeholder="Yangilik nomi"
              value={faqData.questionL}
              onChange={(e) =>
                setFaqData({ ...faqData, questionL: e.target.value })
              }
            />
            <label htmlFor="Comment">Izoh</label>
            <textarea
              className="comment"
              type="text"
              id="Comment"
              name="comment"
              autoComplete="off"
              value={faqData.answerL}
              placeholder="Izoh"
              onChange={(e) =>
                setFaqData({ ...faqData, answerL: e.target.value })
              }
            />
            <label htmlFor="adminName">Янгилик номи</label>

            <input
              className="adminName"
              type="text"
              id="adminName"
              name="fullName"
              autoComplete="off"
              placeholder="Янгилик номи"
              value={faqData.questionK}
              onChange={(e) =>
                setFaqData({ ...faqData, questionK: e.target.value })
              }
            />
            <label htmlFor="Comment">Изоҳ</label>
            <textarea
              className="comment"
              type="text"
              id="Comment"
              name="comment"
              autoComplete="off"
              value={faqData.answerK}
              placeholder="Изоҳ"
              onChange={(e) =>
                setFaqData({ ...faqData, answerK: e.target.value })
              }
            />

            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
        </div>
      </Modal>

      <ul className="news-list">
        {faqItems.map((faqItem) => (
          <li className="news-item" key={faqItem.id}>
            <button
              className="news-btn"
              onClick={() => handleActionsClick(faqItem.id)}
            >
              &#x22EE;
            </button>
            {showActions === faqItem.id && (
              <div key={`actions-${faqItem.id}`}>
                <button
                  className="new-delete"
                  onClick={() => handleDeleteClick(faqItem.id)}
                >
                  <img src={Trush_Icon} alt="Trush" width={25} height={25} />{" "}
                  Delete
                </button>
              </div>
            )}
            <h2 className="new-title">{faqItem.question}</h2>
            <p className="news-content">{faqItem.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
