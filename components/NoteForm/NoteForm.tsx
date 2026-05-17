'use client';
import css from './NoteForm.module.css'
import { useId } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { createNote } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation'; 
import type { NoteTag } from '@/types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';








export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();


  const handleChange = (event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
    }
  
  const queryClient = useQueryClient();
  const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    toast.success('Successfully created!');
    clearDraft();
  router.push('/notes/filter/all');
  },
  });
  

  const handleSubmit = async (formData: FormData) => {
      const values = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    if (!values.title || values.title.length < 3) return;
    if (values.title.length > 50) return;
    if (values.content && values.content.length > 500) return;


  await createMutation.mutateAsync(values);

};
          
       return (
          <form action={handleSubmit} className={css.form}>
            <div className={css.formGroup}>
              <label  htmlFor={`${fieldId}-title`}>Title</label>
             <input defaultValue={draft?.title} onChange={handleChange} id={`${fieldId}-title`} type="text" name="title" className={css.input} />
 
           </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
             <textarea
               defaultValue={draft?.content}
               onChange={handleChange}
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
             />
     
            </div>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <select defaultValue={draft?.tag} onChange={handleChange} id={`${fieldId}-tag`} name="tag" className={css.select}>
               <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
             </select>
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={() => { router.back()}}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={false}
              >
                Create note
              </button>
            </div>
          </form>
        )
    }
  