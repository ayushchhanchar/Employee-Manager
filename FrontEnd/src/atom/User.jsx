import { atom } from "recoil";

const UserAtom = atom({
    key: 'UserAtom',
    default: {
        username: '',
        email: '',
        password: '',
        role: '',   
    },
});
export default UserAtom;    