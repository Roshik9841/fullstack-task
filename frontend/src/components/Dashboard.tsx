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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Buyer Dashboard</h1>
          <p style={{ margin: 0, color: '#666' }}>Welcome back, <strong>{user.name}</strong> ({user.role})</p>
        </div>
        <button 
          onClick={onLogout}
          style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      {errorMsg && (
        <div style={{ color: 'white', background: '#ef4444', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {(properties.isLoading || favourites.isLoading) ? (
        <p>Loading your data...</p>
      ) : (
        <div>
   
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>My Favourites ({myLikedProperties.length})</h2>
            {myLikedProperties.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>You haven't liked any properties yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {myLikedProperties.map(property => (
                  <li key={property.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <strong>{property.address}</strong>
                      <div style={{ color: '#64748b' }}>${property.price.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: true })}
                      disabled={updateFavourite.isPending}
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

      
          <section>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Available Properties</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {(properties.data || []).map(property => {
                const liked = isPropertyLiked(property.id);
                return (
                  <div key={property.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{property.address}</h3>
                    <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>${property.price.toLocaleString()}</p>
                    <button 
                      onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: liked })}
                      disabled={updateFavourite.isPending}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        background: liked ? '#ef4444' : '#2563eb', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                      }}
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