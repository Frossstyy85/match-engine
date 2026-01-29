import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/client";

export function useQueryProjects() {
    return useQuery({
        queryKey: ['all_projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select()
            return data
        }
    })
}


