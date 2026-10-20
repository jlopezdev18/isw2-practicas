
  const handleRockSelection = () => {
    setUserSelection({
      selection: "rock",
      src: "/icon-rock.svg",
      alt: "Rock Icon",
      border: "border-danger",
    });
  };
  const handlePaperSelection = () => {
    setUserSelection({
      selection: "paper",
      src: "/icon-paper.svg",
      alt: "Paper Icon",
      border: "border-primary"
    });
  };
