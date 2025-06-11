import React from 'react'

function Cards({item}) {
    return (
      <>
        <div>
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="px-10 pt-10">
              <img src={item.image} alt="Shoes" className="rounded-xl w-60 h-50" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{item.name}</h2>
              <p>{item.title}</p>
              <div className="card-actions">
                <button className="bg-[#1c7856] text-black py-2 px-4 rounded-md hover:bg-green-300 duration-300 cursor-pointer ">
                  Consult
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Cards
