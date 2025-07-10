import {atom} from 'recoil'

export const CollapsedAtom =atom({
    key:'collapsedAtom',
    default:true
})

export const profileAtom = atom({
    key:'profileAtom',
    default:false
})
export const notiAtom = atom({
    key:'notiAtom',
    default:false
})
export const leaveAtom = atom({
    key:'leaveAtom',
    default:false
})
export const holidayAtom = atom({
    key:'holidayAtom',
    default:false
})