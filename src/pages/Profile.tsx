import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Wallet, LogOut, CheckCircle2, ShieldCheck, CreditCard, X, Smartphone, DollarSign } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile, apex } = useStore();
  
  // Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(currentUser?.hourlyRate?.toString() || '35');

  // M-Pesa / Wallet Modal States
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [amount, setAmount] = useState('50');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ 
      name, 
      bio, 
      hourlyRate: currentUser?.role === 'tutor' ? Number(hourlyRate) : undefined 
    });
    setIsEditing(false);
  };

  const handleMpesaTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setGatewayMessage(null);

    try {
      // Execute the STK Push Edge Function
      const res = await apex.scripts.run('kenya-payment-gateway', { 
        phone, 
        amount: Number(amount) 
      });

      if (res.error) throw new Error(res.error);

      setGatewayMessage({
        type: 'success',
        text: 'M-Pesa prompt sent to your phone! Please enter your PIN to authorize the transaction.'
      });

      // In a real app, you would wait for the Safaricom Webhook. 
      // For this demo, we auto-credit the wallet after 5 seconds to simulate a successful webhook cycle.
      setTimeout(async () => {
        await apex.scripts.run('manage-wallet', { action: 'topup', amount: Number(amount) });
        await useStore.getState().init(); // Refresh UI Balance
        setIsMpesaModalOpen(false);
        setIsProcessing(false);
      }, 5000);

    } catch (err: any) {
      setGatewayMessage({ type: 'error', text: err.message || 'Payment gateway error' });
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = prompt('Enter amount to withdraw (USD):', '50');
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
    
    setIsProcessing(true);
    try {
      const res = await apex.scripts.run('manage-wallet', { action: 'withdraw', amount: Number(withdrawAmount) });
      if (res.error) throw new Error(res.error);
      alert('Withdrawal successful!');
      await useStore.getState().init();
    } catch (err: any) {
      alert(err.message || 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-md">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white heading-font">Account Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your identity and financial ledger.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Settings Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base heading-font">Personal Details</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-sm outline-none focus:border-sky-500" />
              </div>
              
              {currentUser?.role === 'tutor' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Hourly Rate (USD)</label>
                  <input required type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-sm outline-none focus:border-sky-500" />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio</label>
                <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-sm outline-none focus:border-sky-500 resize-none" />
              </div>
              
              <button type="submit" className="w-full bg-sky-600 text-white font-bold py-2.5 rounded-xl hover:bg-sky-700 transition-colors">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <img src={currentUser?.avatar} alt={currentUser?.name} className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">{currentUser?.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email}</span>
                  <span className="mt-1 inline-block text-[9px] bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {currentUser?.role}
                  </span>
                </div>
              </div>
              {currentUser?.role === 'tutor' && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hourly Rate</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">${currentUser.hourlyRate}/hr</span>
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biography</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {currentUser?.bio || "No bio provided."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Ledger Card */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Wallet className="w-5 h-5" />
              <h3 className="font-bold text-sm tracking-widest uppercase">Escrow Wallet Ledger</h3>
            </div>
            
            <p className="text-4xl font-black heading-font mt-4 tracking-tight">
              ${currentUser?.balance?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Available secured funds</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
            <button 
              onClick={() => setIsMpesaModalOpen(true)}
              className="flex items-center justify-center gap-1.5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors"
            >
              <CreditCard className="w-4 h-4" /> M-Pesa TopUp
            </button>
            <button 
              onClick={handleWithdraw}
              disabled={isProcessing}
              className="flex items-center justify-center gap-1.5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>

      </div>

      {/* M-Pesa Payment Modal */}
      {isMpesaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 heading-font flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" /> M-Pesa Express
              </h4>
              <button onClick={() => setIsMpesaModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {gatewayMessage ? (
              <div className="text-center py-6">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${gatewayMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {gatewayMessage.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{gatewayMessage.type === 'success' ? 'Request Sent!' : 'Error'}</h3>
                <p className="text-xs text-slate-500 mt-2">{gatewayMessage.text}</p>
                {gatewayMessage.type === 'success' && (
                  <div className="mt-6 flex justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleMpesaTopup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 px-4 py-3 rounded-xl outline-none text-sm text-slate-800 dark:text-slate-100 font-mono"
                    placeholder="e.g. 0712345678"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Amount (KES / USD Equivalent)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="5"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-3 rounded-xl outline-none text-sm text-slate-800 dark:text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl flex gap-2 text-xs text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 mt-4">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <p>You will receive an STK Push prompt on your phone. Enter your M-Pesa PIN to complete the top-up.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isProcessing ? 'Connecting to Safaricom...' : 'Trigger STK Push'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}