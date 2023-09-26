import { useState } from 'react'
import Start from './api/Start';
import GetFlatsList from './api/GetFlatsList';
import './FlatsBoard.css';
import FlatsBox from '../FlatBox/FlatBox';

export default function FlatsBoard() {
    const isStarted = Start();

    const [page, setPage] = useState<number>(1);

    const { flats, hasMore } = GetFlatsList(page, isStarted);

    function incPage() {
      setPage(prev => prev + 1)
    }

    function decPage() {
      setPage(prev => prev - 1)
    }

    return (
      <div>
        <header className="header centered">Reality viewer</header>

        <div className="flatsContainer">
          {flats.length 
            ? flats.map((flat, ind) => {
              return <FlatsBox flat={flat} key={ind}/>
            })
            : <div className='emptyInfo centered'>No flats to display</div>
          }
        </div>
        
        <div className="pagContainer centered">
          <div className="pagination">
            <button className="pagButtonBasic pagButton centered" onClick={decPage} disabled={page === 1}> 
              &lt;
            </button>
            <div className="pagButtonBasic pageNum centered">
              {page}
              </div>
            <button className="pagButtonBasic pagButton centered" onClick={incPage} disabled={!hasMore}>
               &gt; 
            </button>
          </div>
        </div>
      </div>
    )
}
