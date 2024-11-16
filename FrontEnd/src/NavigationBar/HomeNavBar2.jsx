import React from 'react'
import { useRecoilValue } from 'recoil';
import { CollapsedAtom } from '../atom/Collapsed';
import { Link, NavLink } from 'react-router-dom';
import '../styles/link.css'

const HomeNavBar2 = ({titles,name,main}) => {

    const isCollapsed = useRecoilValue(CollapsedAtom);

    return (
        <>
            <div className={`${isCollapsed ? "h-12 w-[95vw] float-end bg-slate-100 px-16 pt-1 " : " h-12 w-[80%] float-end bg-slate-100 px-11 pt-1"}`}>
                <div className='flex justify-start items-center mt-2 gap-4'>
                    <div className='text-slate-900'>
                        {titles.map((title, index) => (    
                            <NavLink key={index} to={`/${main}/${name}/${title}`} className={({ isActive }) => isActive ? "nav-link active"   : "nav-link"  }>{title}</NavLink>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default HomeNavBar2




// h-12 w-[95vw] float-end bg-slate-100 px-10 pt-1