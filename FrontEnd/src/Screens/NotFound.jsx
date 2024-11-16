import React from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'


const Announcement = () => {
    const isCollapsed = useRecoilValue(CollapsedAtom);
    return (
        <>
                <h2>Page Not Found .......</h2>
        </>
    )
}

export default Announcement