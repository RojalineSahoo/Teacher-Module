import React from "react";
import { useParams } from "react-router-dom";

const AssessmentDetails = () => {
  const { id } = useParams();

  return (
  <div style={{ padding: "24px" }}>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div>
        <h1>
          Assessment Details
        </h1>

        <p>
          Assessment ID: {id}
        </p>
      </div>

      <button>
        Add Question
      </button>
    </div>

  </div>
);
}

export default AssessmentDetails;