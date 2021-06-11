// import produce from "immer";
interface UserState {
  userInfo: {
    id: number,
    name: string,
  }
}
interface StoreAction {
  type: string;
  payload: any;
}

const initState: UserState = {
  userInfo: {
    id: 0,
    name: '',
  }
}

const userReducer = (state=initState, action:StoreAction):object => {
  switch(action.type) {
    case 'SAVE_USER_INFO':
      return {
        ...state,
      }
    default:
      return state
  }
}

export {userReducer}