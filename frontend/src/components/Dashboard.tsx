import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties, fetchFavourites, addFavourite, removeFavourite } from '../services/service';
import { LogOut, Heart, Home, LayoutDashboard, User, Trash2, MapPin, DollarSign } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans animate-in">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl text-white">
              <LayoutDashboard size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">RealEstate Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User size={18} className="text-muted-foreground" />
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive rounded-lg border border-border"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {errorMsg && (
          <div className="mb-6 flex items-center p-4 text-destructive-foreground bg-destructive rounded-xl border border-destructive animate-in">
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {(properties.isLoading || favourites.isLoading) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Loading properties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar with Favourites */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Heart size={20} className="text-destructive fill-destructive" />
                    My Favourites
                  </h2>
                  <span className="bg-secondary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {myLikedProperties.length}
                  </span>
                </div>

                {myLikedProperties.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-muted-foreground">You haven't liked any properties yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myLikedProperties.map(property => (
                      <div key={property.id} className="group p-3 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-border transition-all">
                        <div className="overflow-hidden">
                          <p className="font-semibold text-sm truncate">{property.address}</p>
                          <p className="text-xs text-primary font-medium">${property.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: true })}
                          disabled={updateFavourite.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats / Extra Info card */}
              <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Quick Note</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to your dashboard. Here you can browse available properties and manage your favourites list.
                </p>
              </div>
            </aside>

            {/* Main Content: Properties List */}
            <section className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Available Properties</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home size={16} />
                  <span>{(properties.data || []).length} results found</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(properties.data || []).map(property => {
                  const liked = isPropertyLiked(property.id);
                  return (
                    <div 
                      key={property.id} 
                      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          <Home className="text-slate-400 dark:text-slate-600" size={40} />
                        </div>
                        <div className="absolute top-3 right-3">
                          <button 
                            onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: liked })}
                            disabled={updateFavourite.isPending}
                            className={`p-2 rounded-full shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/20 transition-all ${
                              liked 
                                ? 'bg-destructive text-destructive-foreground' 
                                : 'bg-white/80 dark:bg-black/40 text-muted-foreground hover:text-destructive'
                            }`}
                          >
                            <Heart size={18} fill={liked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin size={14} className="shrink-0" />
                            <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                              {property.address}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center text-xl font-black gap-0.5">
                            <DollarSign size={18} className="text-primary mt-0.5" />
                            <span>{property.price.toLocaleString()}</span>
                          </div>
                          
                          <button 
                            onClick={() => updateFavourite.mutate({ id: property.id, isCurrentlyLiked: liked })}
                            disabled={updateFavourite.isPending}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              liked 
                                ? 'bg-secondary text-foreground hover:bg-slate-200 dark:hover:bg-slate-800' 
                                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95'
                            }`}
                          >
                            {liked ? 'Unfavourite' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}