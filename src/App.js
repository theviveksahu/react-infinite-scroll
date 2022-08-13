import { useEffect, useRef, useState } from "react";
import "./styles.css";

const URL = `https://picsum.photos/v2/list`;

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((no) => no + 1);
      }
    })
  );

  const fetchData = async () => {
    const res = await fetch(`${URL}?page=${page}&limit=10`);
    const list = await res.json();
    setData((prev) => [...prev, ...list]);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const current = lastElement;
    const currentObserver = observer.current;
    if (current) {
      currentObserver.observe(current);
    }
    return () => {
      if (current) {
        currentObserver.unobserve(current);
      }
    };
  }, [lastElement]);

  return (
    <div className="App">
      {data.map((image, i) => {
        const isLastElement = data.length === i + 1;
        return isLastElement ? (
          <img
            ref={setLastElement}
            key={image.id}
            alt={image.id}
            src={image.download_url}
          />
        ) : (
          <img key={image.id} alt={image.id} src={image.download_url} />
        );
      })}
    </div>
  );
}
