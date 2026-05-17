
import type { Note, NoteTag } from '../../types/note';
import  {NoteFormValues} from '../../components/NoteForm/NoteForm';
import { User } from '@/types/user';
import { nextServer } from './api';


export interface LoginData {
  email: string;
  password: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

 export interface FetchNotesProps{
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(query:string, page:number,tag?:NoteTag ) {
    const res = await nextServer.get<FetchNotesProps>('/notes', {
        params: {
            search: query,
            page,
            tag, 
        }
    })
    console.log(res.data);
    return res.data;
}

export async function fetchNoteById (id:string) {
  const res = await nextServer.get<Note>(`/notes/${id}`
  )

  return res.data;
}



export async function createNote(note:NoteFormValues) {
    const res = await nextServer.post<Note>('/notes', note)
    console.log(res.data);
    
    return res.data;
}


export async function deleteNote(id:string) {
    const res = await nextServer.delete<Note>(`/notes/${id}`
    )

return res.data  
}

export type RegisterRequest = {
  email: string;
  password: string;
  username?: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data,);
  return res.data;
};


export const checkSession = async () => {
  const res = await nextServer.get<User | null>('/auth/session');
 
  return res.data;
};

export const getMe = async () => {

  const { data } = await nextServer.get<User>('/users/me');
  return data;
};
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", userData);
  return res.data;
};