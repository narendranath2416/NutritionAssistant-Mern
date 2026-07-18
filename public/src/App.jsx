import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Controls Sign In vs Sign Up tab view
  const [activeTab, setActiveTab] = useState('dashboard');

  // Logs state
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ 
    mealType: 'Breakfast', 
    foodItem: '', 
    calories: '', 
    protein: '0', 
    carbs: '0', 
    fats: '0' 
  });

  // Profile state
  const [profile, setProfile] = useState({ 
    name: '', 
    age: '', 
    weight: '', 
    height: '', 
    goal: 'Weight Loss' 
  });

  // Calculate widget totals dynamically from logged meals
  const totalCalories = logs.reduce((sum, log) => sum + (Number(log.calories) || 0), 0);
  const totalProtein = logs.reduce((sum, log) => sum + (Number(log.protein) || 0), 0);
  const totalCarbs = logs.reduce((sum, log) => sum + (Number(log.carbs) || 0), 0);
  const totalFats = logs.reduce((sum, log) => sum + (Number(log.fats) || 0), 0);

  // Targets based on user goal choice
  const targetCalories = profile.goal === 'Weight Gain' ? 3200 : 1800;
  const targetProtein = profile.goal === 'Weight Gain' ? 170 : 120; 

  const calPercentage = targetCalories > 0 ? Math.min(Math.round((totalCalories / targetCalories) * 100), 100) : 0;
  const proteinPercentage = targetProtein > 0 ? Math.min(Math.round((totalProtein / targetProtein) * 100), 100) : 0; 

  async function fetchLogs(currentEmail) {
    try {
      const res = await fetch(`http://localhost:5000/api/logs?email=${encodeURIComponent(currentEmail)}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setLogs(result.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    }
  }

  async function fetchProfile(currentEmail) {
    try {
      const res = await fetch(`http://localhost:5000/api/logs/profile?email=${encodeURIComponent(currentEmail)}`);
      const result = await res.json();
      if (result.success && result.data) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoggedIn(true);
      fetchLogs(email);
      fetchProfile(email);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert('Account registered successfully! Logging you in...');
      setIsLoggedIn(true);
      fetchLogs(email);
      fetchProfile(email);
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setLogs([]);
    setProfile({ name: '', age: '', weight: '', height: '', goal: 'Weight Loss' });
    setActiveTab('dashboard');
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      mealType: formData.mealType,
      foodItem: formData.foodItem,
      userEmail: email, 
      calories: Number(formData.calories) || 0, 
      protein: Number(formData.protein) || 0, 
      carbs: Number(formData.carbs) || 0, 
      fats: Number(formData.fats) || 0 
    };
    
    try {
      const res = await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFormData({ mealType: 'Breakfast', foodItem: '', calories: '', protein: '0', carbs: '0', fats: '0' });
        fetchLogs(email);
      }
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/logs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchLogs(email);
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userEmail: email,
      name: profile.name,
      age: Number(profile.age) || 0,
      weight: Number(profile.weight) || 0,
      height: Number(profile.height) || 0,
      goal: profile.goal
    };

    try {
      const res = await fetch('http://localhost:5000/api/logs/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Profile configuration metrics updated successfully!');
        fetchProfile(email);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const getInitials = () => {
    if (!profile.name) return 'PN';
    const names = profile.name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0].slice(0, 2).toUpperCase();
  };

  // Modern Interface Auth Component with Toggleable Sign In / Sign Up Tabs
  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card shadow-lg border-0 text-white" style={{ backgroundColor: '#0a192f', width: '100%', maxWidth: '420px', borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Visual Header Branding Row */}
          <div className="p-4 text-center border-bottom border-secondary" style={{ backgroundColor: '#0d233a' }}>
            <h2 className="text-info fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
              <span>🍏</span> My Nutrition Partner
            </h2>
            <p className="text-muted small mb-0">Your personalized macro blueprint tracker</p>
          </div>

          {/* Tab Selection Switches */}
          <div className="d-flex border-bottom border-secondary" style={{ backgroundColor: '#0d233a' }}>
            <button 
              type="button" 
              onClick={() => setIsSignUp(false)}
              className={`btn flex-fill py-2.5 rounded-0 fw-bold border-0 text-white transition-all`}
              style={{ 
                backgroundColor: !isSignUp ? '#0a192f' : 'transparent', 
                borderBottom: !isSignUp ? '3px solid #0dcaf0' : 'none',
                opacity: !isSignUp ? 1 : 0.6
              }}
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => setIsSignUp(true)}
              className={`btn flex-fill py-2.5 rounded-0 fw-bold border-0 text-white transition-all`}
              style={{ 
                backgroundColor: isSignUp ? '#0a192f' : 'transparent', 
                borderBottom: isSignUp ? '3px solid #0dcaf0' : 'none',
                opacity: isSignUp ? 1 : 0.6
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form Segment Container */}
          <div className="p-4">
            {!isSignUp ? (
              // SIGN IN SCREEN FORM
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control text-white border-secondary bg-dark px-3 py-2" 
                    style={{ backgroundColor: '#172a45 !important', border: '1px solid #233e66' }}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="name@domain.com" 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-light small fw-semibold">Password</label>
                  <input 
                    type="password" 
                    className="form-control text-white border-secondary bg-dark px-3 py-2" 
                    style={{ backgroundColor: '#172a45 !important', border: '1px solid #233e66' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••" 
                  />
                </div>
                <button type="submit" className="btn btn-info w-100 py-2 text-white fw-bold shadow">Sign In</button>
              </form>
            ) : (
              // SIGN UP SCREEN FORM
              <form onSubmit={handleSignUpSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control text-white border-secondary bg-dark px-3 py-2" 
                    style={{ backgroundColor: '#172a45 !important', border: '1px solid #233e66' }}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="create@domain.com" 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Create Password</label>
                  <input 
                    type="password" 
                    className="form-control text-white border-secondary bg-dark px-3 py-2" 
                    style={{ backgroundColor: '#172a45 !important', border: '1px solid #233e66' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 6 characters" 
                  />
                </div>
                <div className="mb-4 form-check">
                  <input type="checkbox" className="form-check-input" id="terms" required />
                  <label className="form-check-label text-light small" htmlFor="terms">I agree to the workout & diet tracker terms</label>
                </div>
                <button type="submit" className="btn btn-success w-100 py-2 text-white fw-bold shadow">Register Account</button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Premium Dark Blue Theme Layout Navigation Header */}
      <nav className="navbar navbar-expand navbar-dark px-4 mb-4 shadow" style={{ backgroundColor: '#0a192f' }}>
        <span className="navbar-brand fw-bold text-info fs-3">My Nutrition Partner</span>
        <div className="navbar-nav align-items-center ms-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')} 
            className={`btn btn-link nav-link text-white px-3 fw-semibold ${activeTab === 'dashboard' ? 'text-info border-bottom border-info fw-bold' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            Dashboard Logs
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('profile')} 
            className={`btn btn-link nav-link text-white px-3 fw-semibold ${activeTab === 'profile' ? 'text-info border-bottom border-info fw-bold' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            Profile Setup
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('recommendations')} 
            className={`btn btn-link nav-link text-white px-3 fw-semibold ${activeTab === 'recommendations' ? 'text-info border-bottom border-info fw-bold' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            Recommendations
          </button>

          <div className="d-flex align-items-center bg-info text-white justify-content-center rounded-circle fw-bold ms-4 me-2 shadow-sm" style={{ width: '42px', height: '42px' }}>
            {getInitials()}
          </div>
          <button 
            type="button" 
            onClick={handleSignOut} 
            className="btn btn-sm btn-outline-danger bg-white fw-bold px-3 ms-2"
            style={{ height: '36px' }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'dashboard' && (
          <div>
            {/* Upper Widgets Layer Layout */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card p-3 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center border rounded-circle fw-bold text-dark fs-5 shadow-sm" style={{ width: '70px', height: '70px', minWidth: '70px', border: '5px solid #0d6efd', backgroundColor: '#eef4ff' }}>
                      {calPercentage}%
                    </div>
                    <div className="ms-4">
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">Energy Balance Consumed</span>
                      <h3 className="mb-0 text-dark fw-bold">{totalCalories} / <span className="text-secondary fs-5">{targetCalories} kcal</span></h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card p-3 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center border rounded-circle fw-bold text-dark fs-5 shadow-sm" style={{ width: '70px', height: '70px', minWidth: '70px', border: '5px solid #198754', backgroundColor: '#eefbee' }}>
                      {proteinPercentage}%
                    </div>
                    <div className="ms-4">
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Macro Protein Target</span>
                      <h3 className="mb-0 text-dark fw-bold">{totalProtein} / <span className="text-secondary fs-5">{targetProtein} g</span></h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card p-3 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Carbohydrates</span>
                  <h2 className="mb-0 text-primary fw-bold">{totalCarbs} <span className="text-muted fs-6 fw-normal">g</span></h2>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card p-3 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Dietary Fats</span>
                  <h2 className="mb-0 text-warning fw-bold">{totalFats} <span className="text-muted fs-6 fw-normal">g</span></h2>
                </div>
              </div>
            </div>

            {/* Input Form & Feed Track Grid Block */}
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card p-4 shadow-sm border-0 text-white" style={{ backgroundColor: '#0a192f', borderRadius: '12px' }}>
                  <h4 className="mb-3 text-info fw-bold">Log a New Meal</h4>
                  <form onSubmit={handleLogSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-light small fw-semibold">Meal Segment</label>
                      <select className="form-select border-0 text-white" style={{ backgroundColor: '#172a45' }} value={formData.mealType} onChange={(e) => setFormData({...formData, mealType: e.target.value})}>
                        <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-light small fw-semibold">Food Description</label>
                      <input type="text" className="form-control border-0 text-white" style={{ backgroundColor: '#172a45' }} value={formData.foodItem} onChange={(e) => setFormData({...formData, foodItem: e.target.value})} required placeholder="e.g., Rice & Grilled Chicken" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-light small fw-semibold">Calories (kcal)</label>
                      <input type="number" className="form-control border-0 text-white" style={{ backgroundColor: '#172a45' }} value={formData.calories} onChange={(e) => setFormData({...formData, calories: e.target.value})} required min="0" />
                    </div>
                    <div className="row g-2">
                      <div className="col-4">
                        <label className="form-label text-light extra-small">Prot (g)</label>
                        <input type="number" className="form-control border-0 text-white" style={{ backgroundColor: '#172a45' }} min="0" value={formData.protein} onChange={(e) => setFormData({...formData, protein: e.target.value})} />
                      </div>
                      <div className="col-4">
                        <label className="form-label text-light extra-small">Carbs (g)</label>
                        <input type="number" className="form-control border-0 text-white" style={{ backgroundColor: '#172a45' }} min="0" value={formData.carbs} onChange={(e) => setFormData({...formData, carbs: e.target.value})} />
                      </div>
                      <div className="col-4">
                        <label className="form-label text-light extra-small">Fats (g)</label>
                        <input type="number" className="form-control border-0 text-white" style={{ backgroundColor: '#172a45' }} min="0" value={formData.fats} onChange={(e) => setFormData({...formData, fats: e.target.value})} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-info w-100 mt-4 py-2 text-white fw-bold shadow-sm">Add Log Entry</button>
                  </form>
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '12px' }}>
                  <h4 className="mb-4 text-dark fw-bold border-bottom pb-2">Tracked Consumption Feed Logs</h4>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Meal Segment</th>
                          <th>Food Item</th>
                          <th>Energy</th>
                          <th>Macros Grid</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length === 0 ? (
                          <tr><td colSpan="5" className="text-center text-muted py-4">No nutritional records found for today.</td></tr>
                        ) : (
                          logs.map(log => (
                            <tr key={log._id}>
                              <td><span className="badge bg-secondary px-2.5 py-1.5">{log.mealType}</span></td>
                              <td className="fw-bold text-dark">{log.foodItem}</td>
                              <td className="text-danger fw-bold">{log.calories} kcal</td>
                              <td>
                                <span className="text-primary fw-bold small">P: {log.protein}g</span> | 
                                <span className="text-success fw-bold small"> C: {log.carbs}g</span> | 
                                <span className="text-warning fw-bold small"> F: {log.fats}g</span>
                              </td>
                              <td><button type="button" onClick={() => handleDeleteLog(log._id)} className="btn btn-sm btn-outline-danger px-3">Delete</button></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card p-4 shadow-sm border-0 bg-white mx-auto" style={{ maxWidth: '700px', borderRadius: '12px' }}>
            <h4 className="mb-4 text-dark border-bottom pb-2 fw-bold">Update Physical Configurations</h4>
            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Profile Name</label>
                  <input type="text" className="form-control" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Age Index (Years)</label>
                  <input type="number" className="form-control" value={profile.age} onChange={(e) => setProfile({...profile, age: e.target.value})} required min="1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Bodyweight (kg)</label>
                  <input type="number" className="form-control" value={profile.weight} onChange={(e) => setProfile({...profile, weight: e.target.value})} required min="1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Height (cm)</label>
                  <input type="number" className="form-control" value={profile.height} onChange={(e) => setProfile({...profile, height: e.target.value})} required min="1" />
                </div>
                <div className="col-12 mt-3">
                  <label className="form-label fw-bold text-primary">Select Target Blueprint Strategy</label>
                  <select className="form-select bg-light fw-bold text-dark" value={profile.goal} onChange={(e) => setProfile({...profile, goal: e.target.value})}>
                    <option>Weight Loss</option>
                    <option>Weight Gain</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-info mt-4 w-100 py-2 text-white fw-bold shadow-sm">Save Configuration Plan</button>
            </form>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="card p-4 shadow-sm border-0 bg-white mx-auto" style={{ maxWidth: '900px', borderRadius: '12px' }}>
            <h4 className="mb-3 text-dark border-bottom pb-2 fw-bold">Nutritional Blueprint Matrix</h4>
            <p className="text-muted">Target configuration dynamic logic strategies matching: <strong className="text-primary">{profile.name || 'User'} ({profile.goal})</strong></p>
            
            <div className="p-3 mb-4 rounded border-start border-info border-4" style={{ backgroundColor: '#f0f7ff' }}>
              <h5 className="text-primary fw-bold mb-1">Calculated Caloric Level Target</h5>
              <p className="mb-3 fw-bold text-dark fs-5">{profile.goal === 'Weight Gain' ? 'Surplus (Target: ~3,200 kcal/day)' : 'Deficit (Target: ~1,500 - 1,800 kcal/day)'}</p>
              <h5 className="text-primary fw-bold mb-1">Macro Matrix Routine Strategies</h5>
              <p className="mb-0 text-secondary small">
                {profile.goal === 'Weight Gain' 
                  ? 'Focus on dynamic, energy-dense whole food options. Prioritize caloric surplus parameters, steady complex carbohydrates, and clean fats to fuel workouts properly.' 
                  : 'Maintain a rigid clean caloric deficit window. Emphasize dense protein isolate structures and green fibrous vegetables while omitting refined dynamic sugars.'}
              </p>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="card p-3 h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h6 className="fw-bold text-dark border-bottom pb-2">🌅 Breakfast Blueprints</h6>
                  <ul className="small ps-3 text-secondary">
                    {profile.goal === 'Weight Gain' 
                      ? (<><li>4 Whole eggs scrambled with 2 slices of whole wheat bread toast</li><li>Large oatmeal bowl with full cream milk, honey, and peanut butter</li><li>1 Banana blended with clean whey protein isolate and handful of cashews</li></>)
                      : (<><li>3 Egg whites scrambled with baby spinach, tomatoes and mushrooms</li><li>Sprouted green lentils gram salad topped with olive oil and squeezed lime</li><li>Oatmeal prepared with warm water, standard almond milk, and raw berries</li></>)
                    }
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card p-3 h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h6 className="fw-bold text-dark border-bottom pb-2">🏙️ Lunch Configurations</h6>
                  <ul className="small ps-3 text-secondary">
                    {profile.goal === 'Weight Gain' 
                      ? (<><li>200g Grilled chicken breast or paneer cubes with a deep bowl of brown rice</li><li>Thick yellow dal bowl with mixed subzi curry and ghee-smeared chapatis</li><li>Salmon fish fillets served with baked sweet potato mash blocks</li></>)
                      : (<><li>150g Boiled fish or baked organic tofu strips with a large leaf salad bowl</li><li>Chana chickpea salad tossed with chopped cucumber, radish, and raw onions</li><li>Clear hot vegetable broth alongside small measured brown rice frames</li></>)
                    }
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card p-3 h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h6 className="fw-bold text-dark border-bottom pb-2">🌆 Mid-Day Snack Adjustments</h6>
                  <ul className="small ps-3 text-secondary">
                    {profile.goal === 'Weight Gain' 
                      ? (<><li>Handful of mixed raw walnuts, almonds, pumpkin seeds, and raisins</li><li>Avocado sourdough slice with thick hemp seed coatings</li><li>Fruit matrix smoothie with organic greek yogurt and dark cocoa bits</li></>)
                      : (<><li>One cup of sugar-free plain Greek yogurt mixed with clean flaxseeds</li><li>Handful of dry roasted plain makhana foxnut shells</li><li>Fresh crisp cucumber sticks paired with home-prepared low-fat clean hummus</li></>)
                    }
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card p-3 h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h6 className="fw-bold text-dark border-bottom pb-2">🌌 Restorative Dinner Systems</h6>
                  <ul className="small ps-3 text-secondary">
                    {profile.goal === 'Weight Gain' 
                      ? (<><li>Lean ground chicken or spiced paneer burritos inside whole grain wraps</li><li>Baked potato jackets layered with canned tuna fish chunks or cheese layers</li><li>Warm glass of standard cows milk mixed with dynamic ashwagandha root extract</li></>)
                      : (<><li>Freshly tossed grilled chicken salad bowl zero fat creamy commercial dressings</li><li>Stir-fried broccoli crowns, bell peppers, baby corn, and fresh mushrooms</li><li>Light egg white omelet wrap containing clean steamed asparagus spearheads</li></>)
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}