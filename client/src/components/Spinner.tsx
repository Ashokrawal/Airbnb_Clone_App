import { TailSpin } from "react-loader-spinner";
import "../styles/Layout.css";

const Spinner = () => {
  return (
    <div className="spinner">
      <TailSpin
        height={100}
        width={200}
        color="#f5385d"
        radius="1"
        visible={true}
      />
    </div>
  );
};

export default Spinner;
