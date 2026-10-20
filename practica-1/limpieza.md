
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

Version Refactorizada
const handleSelection = (selection) => {
  const option = randomSelection.find(
    (option) => option.selection === selection
  );

  if (!option) return;

  setUserSelection({ ...option });
};

const handleRockSelection = () => handleSelection("rock");
const handlePaperSelection = () => handleSelection("paper");
const handleScissorsSelection = () => handleSelection("scissors");
