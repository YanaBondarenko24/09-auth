import { fetchNotes } from '@/lib/api/serverApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';
import { Metadata } from 'next';




type Props = {
  searchParams:{
    query: string,
    page: number,
  };
  params: Promise<{ slug: string[] }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentTag  = slug[0] === "all" ? "all" : slug[0];
  return {
    title: `Category: ${currentTag === "all" ? "All Notes" : currentTag}`,
    description: `Notes in the ${currentTag === "all" ? "all categories" : currentTag} category`,
    openGraph: {
      title: `Category: ${currentTag === "all" ? "All Notes" : currentTag}`,
      description: `Notes in the ${currentTag === "all" ? "all categories" : currentTag} category`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
export default async function Notes({
  searchParams,params }:Props) {
  const { slug } = await params;
  const rawTag = slug?.[0];
  const tag = rawTag === "all" ? undefined : (rawTag as NoteTag | undefined);
  
  const queryClient = new QueryClient();
  const search = await searchParams;
  const page = Number(search.page ?? 1);
  const query = String(search.query ?? '')
  await queryClient.prefetchQuery({
    queryKey: ["notes",query,page,tag],
    queryFn: () => fetchNotes(query,page,tag),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        tag={tag}/>
    </HydrationBoundary>
  )
}
