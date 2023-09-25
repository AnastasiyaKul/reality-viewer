import './FlatBox.css';
import { IFlatDescription } from '../FlatsBoard/api/GetFlatsList.js';

export default function FlatsBox(props: { flat: IFlatDescription }) {
    const { image, title, url } = props.flat; 

  return (
      <div className="flatBox">
        <div className="imgContainer">
          <img src={image} alt="flat"></img>
        </div>

        <div className="details">
          <div className="title">{title}</div>
          <div className="btnContainer">
            <a href={url} target="_blank" rel="noreferrer">
                <div className="detailsBtn"> View Details </div>
            </a>
          </div>
        </div>
      </div>
  )
}
