import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties, fetchFavourites, addFavourite, removeFavourite } from '../services/service';

interface DashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ token, user, onLogout }: DashboardProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const properties = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const favourites = useQuery({
    queryKey: ['favourites'],
    queryFn: () => fetchFavourites(token),
  });

  const updateFavourite = useMutation({
    mutationFn: async ({ id, isCurrentlyLiked }: { id: string; isCurrentlyLiked: boolean }) => {
      if (isCurrentlyLiked) {
        await removeFavourite(token, id);
      } else {
        await addFavourite(token, id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    }
  });

  const isPropertyLiked = (propertyId: string) => {
    if (!favourites.data) return false;
    return favourites.data.some(fav => fav.propertyId === propertyId);
  };

  const myLikedProperties = (properties.data || []).filter(p => isPropertyLiked(p.id));

  return (
    <div className="p-5 font-sans max-w-[800px] mx-auto">
      <header className="flex justify-between items-center border-b border-[#ddd] pb-2.5 mb-5">
        <div>
          <h1 className="m-0 text-2xl font-bold">Buyer Dashboard</h1>
          <p className="m-0 text-[#666]">Welcome back, <strong>{user.name}</strong> ({user.role})</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
        >
          Logout
        </button>
      </header>

      {errorMsg && (
        <div className="text-white bg-[#ef4444] p-2.5 rounded-md mb-5">
          {errorMsg}
        </div>
      )}

      {(properties.isLoading || favourites.isLoading) ? (
        <p>Loading your data...</p>
      ) : (
        <div>
          <section className="mb-10">
            <h2 className="text-2xl border-b border-[#eee] pb-1 font-semibold">My Favourites ({myLikedProperties.length})</h2>
            {myLikedProperties.length === 0 ? (
              <p className="text-[#94a3b8] italic">You haven't liked any properties yet.</p>
            ) : (
              <ul className="list-none p-0">
                {myLikedProperties.map(property => (
                  <li key={property.id} className="flex justify-between p-2.5 border-b border-[#f1f5f9]">
                    <div>
                      <strong>{property.address}</strong>
                      <div className="text-[#64748b]">${property.price.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: true })}
                      disabled={updateFavourite.isPending}
                      className="text-[#ef4444] bg-none border-none cursor-pointer font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl border-b border-[#eee] pb-1 font-semibold">Available Properties</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-4">
              {(properties.data || []).map(property => {
                const liked = isPropertyLiked(property.id);
                return (
                  <div key={property.id} className="border border-[#e2e8f0] rounded-lg p-[15px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                    <h3 className="m-[0_0_10px_0] text-lg font-bold">{property.address}</h3>
                    <p className="m-[0_0_15px_0] text-[1.1rem] font-bold">${property.price.toLocaleString()}</p>
                    <button 
                      onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: liked })}
                      disabled={updateFavourite.isPending}
                      className={`w-full p-2.5 rounded-md border-none text-white font-bold cursor-pointer transition-colors ${
                        liked ? 'bg-[#ef4444]' : 'bg-[#2563eb]'
                      }`}
                    >
                      {liked ? 'Remove' : 'Like'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}