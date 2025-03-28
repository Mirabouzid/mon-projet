import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from "react-icons/md";
import moment from 'moment';
import { MdDelete, MdModeEdit } from "react-icons/md";
import ClickRating from './ClickRating';



export default function ListingItem({ listing, id, onEdit, onDelete }) {

    const formatDate = (timestamp) => {
        if (!timestamp?.toDate) return ''
        return moment(timestamp.toDate()).fromNow();
    }
    return (
        <li className=' relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px] '>
            <Link className='contents' to={`/category/${listing.type}/${id}`}>
                <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
                    loading='lazy'
                    src={listing.imgUrls[0]}
                />

                <div className="listing-details">
                    {listing.timestamp && (
                        <p className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'>
                            Publié {formatDate(listing.timestamp)}
                        </p>
                    )}
                    <div className='w-full p-[10px]'>
                        <div className='flex items-center space-x-1'>
                            <MdLocationOn className='h-4 w-4 text-green-600 ' />
                            <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
                        </div>
                        <p className='font-semibold m-0 text-lg truncate'>{listing.name}</p>
                        <p className='text-[#457b9d] mt-2 font-semibold'>
                            $
                            {listing.offer
                                ? listing.discountedPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                : listing.regularPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {listing.type === "rent" && " / month"}
                        </p>
                        <div className='flex gap-4 mt-2'>
                            <div >
                                <p className='text-xs font-bold'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed "}</p>
                            </div>
                            <div>
                                <p className='text-xs font-bold '>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Baths"}</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            < ClickRating />
                        </div>


                    </div>

                </div>
            </Link>
            {onDelete && (
                <MdDelete className='absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500'
                    onClick={() => onDelete(listing.id)}
                />
            )}
            {onEdit && (
                <MdModeEdit className='absolute bottom-2 right-7 h-4 cursor-pointer '
                    onClick={() => onEdit(listing.id)}
                />

            )}
        </li>
    )
}
