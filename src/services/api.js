import { supabase } from './supabase';

export const api = {
  async get(endpoint, params = {}) {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .select(params.select || '*')
        .eq(params.filter?.field || '', params.filter?.value || '');
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },
  
  async post(endpoint, data = {}) {
    try {
      const { data: response, error } = await supabase
        .from(endpoint)
        .insert(data)
        .select();
        
      if (error) throw error;
      return response;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }
};