
import styles from "./Loader.module.css"
const Loader = () => {
  return (
    <div className="w-full h-full z-10 flex justify-center items-center">
      <div className={styles.loader}>

      </div>
    </div>
  );
}

export default Loader;
