import { useEffect, useState } from "react";
import "./App.css";

type SiteInfo = Awaited<ReturnType<typeof getSiteInfo>>;

const getSiteInfo = async () => {
  const siteInfo = await webflow.getSiteInfo();
  console.log(siteInfo);
  return siteInfo;
};

type StyleInfo = { name: string; id: string };
const getAllStyles = async (
  setStyles: React.Dispatch<React.SetStateAction<StyleInfo[]>>
) => {
  const allStyles = await webflow.getAllStyles();
  if (allStyles.length > 0) {
    const styles = await Promise.all(
      allStyles.map(async (style) => {
        const name = await style.getName();
        return { name, id: style.id };
      })
    );
    setStyles(styles);
  } else {
    console.log("No styles found in the current context.");
    setStyles([]);
  }
};

function App() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [styles, setStyles] = useState<StyleInfo[]>([]);

  useEffect(() => {
    getSiteInfo().then(setSiteInfo);
    getAllStyles(setStyles);
  }, []);

  return (
    <>
      <div>
        <pre>{JSON.stringify(siteInfo, null, 2)}</pre>
      </div>
      <div>
        <h2>Styles</h2>
        {styles.length > 0 ? (
          <ul>
            {styles.map((style, index) => (
              <li key={index}>{`${index + 1}. Style Name: ${
                style.name
              }, Style ID: ${style.id}`}</li>
            ))}
          </ul>
        ) : (
          <p>No styles found.</p>
        )}
      </div>
    </>
  );
}

export default App;
