import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, boxes }) => {
    const facesArray = () => {
        if(boxes) {
            const newArray = boxes.map(box => {
                return (
                <div
                    className='bounding-box'
                    style={{top:box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
                </div>
                )
            })
            return newArray;
        }
        return null;
    }

    return (
        <div className='center ma'>
            <div className='absolute mt2 shadow-5'>
                { facesArray() }
                <img src={ imageUrl } alt='' id='inputImage' width='500px' height='auto'/>
            </div>
        </div>
    )
}

export default FaceRecognition;