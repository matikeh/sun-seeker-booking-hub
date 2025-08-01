import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/locales';
import { Calendar, Diamond, Check, ChevronDown } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import React from "react";

const PoolSVGLayout = ({ onSeatClick, selectedSeats }: { onSeatClick: (seatId: string) => void, selectedSeats: string[] }) => {
  const cx = 160, cy = 160;
  const arcs = [
    { start: 210, end: 330, radius: 120, count: 16, color: "#b3dafe", area: "Sun Area" },
    { start: 330, end: 390, radius: 120, count: 8, color: "#7ec3f7", area: "VIP Poolside" },
    { start: 390, end: 510, radius: 120, count: 16, color: "#4fa3e3", area: "Resturant Area" },
    { start: 510, end: 570, radius: 120, count: 8, color: "#7ec3f7", area: "Family Area" },
    { start: 210, end: 330, radius: 90, count: 14, color: "#b3dafe", area: "Sun Area" },
    { start: 330, end: 390, radius: 90, count: 7, color: "#7ec3f7", area: "VIP Poolside" },
    { start: 390, end: 510, radius: 90, count: 14, color: "#4fa3e3", area: "Resturant Area" },
    { start: 510, end: 570, radius: 90, count: 7, color: "#7ec3f7", area: "Family Area" },
    { start: 210, end: 330, radius: 60, count: 12, color: "#b3dafe", area: "Sun Area" },
    { start: 330, end: 390, radius: 60, count: 6, color: "#7ec3f7", area: "VIP Poolside" },
    { start: 390, end: 510, radius: 60, count: 12, color: "#4fa3e3", area: "Resturant Area" },
    { start: 510, end: 570, radius: 60, count: 6, color: "#7ec3f7", area: "Family Area" },
  ];

  function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function getAreaFromAngle(angle) {
    if (angle >= 210 && angle <= 330) return "Sun Area";
    if (angle >= 330 && angle <= 390) return "VIP Poolside";
    if (angle >= 390 && angle <= 510) return "Resturant Area";
    if (angle >= 510 && angle <= 570) return "Family Area";
    return "Resturant Area";
  }

  let seatCounter = 1;

  return (
    <svg width={450} height={450}>
      <path
        d={`
          M ${cx - 35},${cy}
          Q ${cx - 40},${cy - 28} ${cx},${cy - 32}
          Q ${cx + 50},${cy - 28} ${cx + 28},${cy}
          Q ${cx + 40},${cy + 28} ${cx},${cy + 30}
          Q ${cx - 40},${cy + 28} ${cx - 35},${cy}
          Z
        `}
        fill="#b3e0fc"
        opacity={0.7}
      />
      <text x={cx} y={cy} textAnchor="middle" dy="0.3em" fontSize={20} fill="#223">Pool</text>
      {arcs.map((arc, i) => {
        const dots = [];
        const step = (arc.end - arc.start) / (arc.count - 1);
        for (let j = 0; j < arc.count; j++) {
          const angle = arc.start + j * step;
          const { x, y } = polarToCartesian(cx, cy, arc.radius, angle);
          const seatId = `S${seatCounter++}`;
          const isSelected = selectedSeats.includes(seatId);
          
          dots.push(
            <circle 
              key={`${i}-${j}`} 
              cx={x} 
              cy={y} 
              r={6} 
              fill={isSelected ? "#ff8c00" : arc.color} 
              opacity={isSelected ? 1 : 0.6}
              style={{ cursor: 'pointer' }}
              onClick={() => onSeatClick(seatId)}
            />
          );
        }
        return dots;
      })}
      <text x={cx-100} y={cy - 110} textAnchor="middle" fontSize={14} fill="#A7CCF1">Sun Area</text>
      <text x={cx + 70} y={cy - 110} textAnchor="start" fontSize={14} fill="#A7CCF1">VIP Poolside</text>
      <text x={cx - 80} y={cy + 120} textAnchor="end" fontSize={14} fill="#A7CCF1">Family Area</text>
      <text x={cx + 100} y={cy + 120} textAnchor="start" fontSize={14} fill="#A7CCF1">Resturant Area</text>
    </svg>
  );
};

const DateTime = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 5, 25)); // June 25, 2025
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [spotDurations, setSpotDurations] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const zones = [
    { id: 'PGA', name: 'PG A', price: '$30,00', color: 'bg-blue-600' },
    { id: 'PGB', name: 'PG B', price: '$55,00', color: 'bg-blue-500' },
    { id: 'PGC', name: 'PG C', price: '$15,00', color: 'bg-teal-600' },
    { id: 'PGD', name: 'PG D', price: '$39,00', color: 'bg-green-400' },
    { id: 'PGE', name: 'PG E', price: '$15,00', color: 'bg-green-600' },
    { id: 'PGF', name: 'PG F', price: '$40,00', color: 'bg-green-500' },
    { id: 'PGG', name: 'PG G', price: '$10,00', color: 'bg-gray-600' },
    { id: 'PGH', name: 'PG H', price: '$10,00', color: 'bg-gray-500' },
  ];

  const durationOptions = [
    { value: '3 hour', label: '3 hours', price: 15 },
    { value: '6 hour', label: '6 hours', price: 20 },
    { value: '9 hour', label: '9 hours', price: 30 },
    { value: 'Whole day', label: 'Whole day', price: 35 },
  ];

  // Generate available spots based on selected seats
  const generateAvailableSpots = () => {
    const areas = ["Sun Area", "VIP Poolside", "Resturant Area", "Family Area"];
    return selectedSeats.map((seatId, index) => {
      const area = areas[index % areas.length];
      return {
        id: seatId,
        area: area,
        time: 'Wednesday, June 25, 2025: 0:00 - 12:00'
      };
    });
  };

  const availableSpots = generateAvailableSpots();

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        // Remove seat
        const newSeats = prev.filter(id => id !== seatId);
        // Remove from spot durations if it exists
        const newDurations = { ...spotDurations };
        delete newDurations[seatId];
        setSpotDurations(newDurations);
        // Reset selected spot if it was this seat
        if (selectedSpot === seatId) {
          setSelectedSpot('');
        }
        return newSeats;
      } else {
        // Add seat
        const newSeats = [...prev, seatId];
        // Set default duration for new seat
        setSpotDurations(prev => ({
          ...prev,
          [seatId]: '6 hour'
        }));
        return newSeats;
      }
    });
  };

  const handleZoneToggle = (zoneId: string) => {
    setSelectedZones(prev =>
      prev.includes(zoneId)
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleSpotDurationChange = (spotId: string, duration: string) => {
    setSpotDurations(prev => ({
      ...prev,
      [spotId]: duration
    }));
  };

  const handleContinue = () => {
    navigate('/booking/summary');
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const duration = spotDurations[seatId] || '6 hour';
      const price = durationOptions.find(opt => opt.value === duration)?.price || 20;
      return total + price;
    }, 0);
  };

  const NUM_SEATS = 16; // adjust as needed for each arc
  const ARC_RADIUS = [140, 120, 100, 80]; // radii for each arc

  const arcAngles = [
    { start: -120, end: -60, label: "Sun Area" },
    { start: -60, end: 0, label: "VIP Poolside" },
    { start: 0, end: 60, label: "Pool" },
    { start: 60, end: 120, label: "Family Area" },
  ];

  function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  const generatePoolLayout = () => {
    const spots = [];
    const centerX = 50;
    const centerY = 50;
    const numRows = 6;
    const spotsPerRow = 3;

    let spotId = 1;

    for (let row = 0; row < numRows; row++) {
      const radius = 35 - (row * 4);

      for (let spot = 0; spot < spotsPerRow; spot++) {
        const angle = (spot * (360 / spotsPerRow) + (row * 20)) * (Math.PI / 180);
        const x = centerX + (radius * Math.cos(angle));
        const y = centerY + (radius * Math.sin(angle));

        spots.push({
          id: spotId,
          x: `${x}%`,
          y: `${y}%`,
          opacity: 0.6 + (Math.random() * 0.4),
        });

        spotId++;
      }
    }

    return spots;
  };

  const poolSpots = generatePoolLayout();

  const arcs = [
    // Each arc: { startAngle, endAngle, radius, count, color }
    { start: 210, end: 330, radius: 150, count: 16, color: "#b3dafe" }, // Sun Area
    { start: 330, end: 390, radius: 150, count: 8, color: "#7ec3f7" },  // VIP Poolside
    { start: 390, end: 510, radius: 150, count: 16, color: "#4fa3e3" }, // Pool
    { start: 510, end: 570, radius: 150, count: 8, color: "#7ec3f7" },  // Family Area
    // Inner arcs (closer to pool)
    { start: 210, end: 330, radius: 120, count: 14, color: "#b3dafe" },
    { start: 330, end: 390, radius: 120, count: 7, color: "#7ec3f7" },
    { start: 390, end: 510, radius: 120, count: 14, color: "#4fa3e3" },
    { start: 510, end: 570, radius: 120, count: 7, color: "#7ec3f7" },
    // Even more inner arcs if you want
  ];

  const labels = [
    { text: "Sun Area", x: 200, y: 40, anchor: "middle" },
    { text: "VIP Poolside", x: 340, y: 120, anchor: "start" },
    { text: "Family Area", x: 60, y: 360, anchor: "end" },
    { text: "Pool", x: 340, y: 340, anchor: "start" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-turquoise-600 relative overflow-hidden">
      {/* Water-like animated background */}
      <div className="absolute inset-0">
        {/* Animated water waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-300/20 to-teal-300/40 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-cyan-300/30 to-transparent rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-radial from-teal-300/25 to-transparent rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-radial from-turquoise-300/30 to-transparent rounded-full animate-pulse delay-1500"></div>
            <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
        
        {/* Floating bubbles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-white/25 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-white/20 rounded-full animate-bounce delay-1100"></div>
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-white/35 rounded-full animate-bounce delay-1400"></div>
        
        {/* Water ripple effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(14,165,233,0.1)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-400 text-sm font-medium">{t('dateTime.stepIndicator') || 'Step 3 of 4'}</span>
            </div> */}
            <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
              {t('dateTime.selectSpotTitle') || 'Reserve your spot'}
            </h1>
            <p className="text-white/90 drop-shadow">{t('dateTime.selectSpotSubtitle') || 'Schedule your sunbed stress-free'}</p>
          </div>

          <div className="flex justify-between items-center mb-8 bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 text-gray-900 hover:text-teal-600 transition-colors">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <div className="text-left">
                    <div className="text-xs text-gray-600">{t('dateTime.selectDate')}</div>
                    <div className="font-medium">{format(selectedDate, "MMM dd, yyyy")}</div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-lg border-white/20" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-3 relative">
              <Diamond className="w-5 h-5 text-teal-500" />
              <button
                onClick={() => setShowZoneDropdown(!showZoneDropdown)}
                className="flex items-center gap-2 text-gray-900 hover:text-teal-600 transition-colors"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-600">{t('dateTime.zones') || 'Zones'}</div>
                  <div className="font-medium">{selectedZones.length} {t('dateTime.selected') || 'Selected'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showZoneDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showZoneDropdown && (
            <Card className="mb-8 bg-white/90 backdrop-blur-xl border-white/30 shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      onClick={() => handleZoneToggle(zone.id)}
                    >
                      <div className="relative">
                        {selectedZones.includes(zone.id) && (
                          <Check className="absolute -top-2 -left-1 w-4 h-4 text-green-500 bg-green-100 rounded-full p-0.5" />
                        )}
                        <div className={`w-8 h-8 ${zone.color} rounded-lg shadow-lg`}></div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                        <div className="text-xs text-gray-600">{zone.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8 bg-white/90 backdrop-blur-xl border-white/30 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('dateTime.poolLayoutTitle') || 'POOL Overview'}
                </h3>
                <p className="text-gray-600 text-sm mt-2">Tap a dot to select your spot</p>
              </div>

              {/* Legend */}
              <div className="flex justify-center items-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#809FCD' }}></div>
                  <span className="text-gray-700 text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#457FC0' }}></div>
                  <span className="text-gray-700 text-sm">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF8C00' }}></div>
                  <span className="text-gray-700 text-sm">Your selection</span>
                </div>
              </div>

              <div className="relative w-80 h-80 mx-auto mb-6">
                <PoolSVGLayout onSeatClick={handleSeatClick} selectedSeats={selectedSeats} />
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-teal-500/20 backdrop-blur-lg rounded-2xl p-4 border border-teal-400/30">
                  <p className="text-teal-700 text-sm text-center font-medium">
                    {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected: {selectedSeats.join(', ')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {availableSpots.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-white text-center drop-shadow-lg">{t('dateTime.availableSpots') || 'Selected Spots'}</h3>
              {availableSpots.map((spot) => (
                <Card
                  key={spot.id}
                  className="border-2 border-teal-400/50 bg-white/90 backdrop-blur-xl shadow-xl shadow-teal-500/20"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-bold text-xl text-gray-900">{t('dateTime.spot')} {spot.id}</span>
                          <span className="text-sm text-teal-700 bg-teal-100 px-3 py-1 rounded-full border border-teal-300">
                            {spot.area}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">{spot.time}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Popover
                          open={openPopover === spot.id}
                          onOpenChange={open => setOpenPopover(open ? spot.id : null)}
                        >
                          <PopoverTrigger asChild>
                            <button
                              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg hover:from-teal-600 hover:to-cyan-700"
                              onClick={e => {
                                e.stopPropagation();
                                setOpenPopover(spot.id);
                              }}
                            >
                              <div>
                                {durationOptions.find(opt => opt.value === (spotDurations[spot.id] || '6 hour'))?.label}
                              </div>
                              <div className="text-xs opacity-80">
                                ${durationOptions.find(opt => opt.value === (spotDurations[spot.id] || '6 hour'))?.price}
                              </div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-40 bg-white/95 backdrop-blur-lg border-white/20" align="end" side="bottom">
                            <div className="flex flex-col">
                              {durationOptions
                                .filter(opt => opt.value !== (spotDurations[spot.id] || '6 hour'))
                                .map(option => (
                                  <button
                                    key={option.value}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleSpotDurationChange(spot.id, option.value);
                                      setOpenPopover(null);
                                    }}
                                    className="flex justify-between items-center px-4 py-2 text-left hover:bg-gray-50 text-gray-900"
                                  >
                                    <div>{option.label}</div>
                                    <div className="text-xs opacity-80">${option.price}</div>
                                  </button>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="w-full py-6 text-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 group shadow-2xl font-semibold rounded-xl"
            size="lg"
          >
            <span className="flex items-center justify-center">
              Confirm 
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm ml-3">
                ${calculateTotalPrice()}
              </div>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateTime;
