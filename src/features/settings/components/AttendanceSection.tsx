/**
 * @file AttendanceSection.tsx
 * @description Attendance Settings section with shifts, geofencing, and IP restrictions.
 */

import React, { useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clock,
  MapPin,
  Wifi,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Switch } from '@/shared/ui/Switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Separator } from '@/shared/ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetAttendanceSettingsQuery,
  useUpdateAttendanceSettingsMutation,
} from '../api/settingsApi';
import {
  updateAttendanceSettingsSchema,
  type AttendanceSettingsFormData,
} from '../schemas/settings.schemas';
import type { AttendanceSettings, ShiftTiming, GeofenceConfig, IpRestriction } from '../types/settings.types';

const SectionCard: React.FC<{
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, children, className }) => (
  <Card className={cn('bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800', className)}>
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

const FormField: React.FC<{
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, error, hint, required, children, className }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500" aria-hidden="true">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
        <Info className="w-3 h-3" />
        {hint}
      </p>
    )}
  </div>
);

const SHIFT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DaysSelector: React.FC<{ value: number[]; onChange: (val: number[]) => void; error?: string }> = ({ value, onChange, error }) => (
  <FormField label="Applicable Days" error={error}>
    <div className="flex flex-wrap gap-2">
      {[
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
      ].map((day) => (
        <label key={day.value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border">
          <input
            type="checkbox"
            checked={value.includes(day.value)}
            onChange={(e) => {
              const newVal = e.target.checked
                ? [...value, day.value]
                : value.filter((d) => d !== day.value);
              onChange(newVal);
            }}
            className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
          />
          {day.label}
        </label>
      ))}
    </div>
  </FormField>
);

const ShiftAccordionItem: React.FC<{
  index: number;
  field: any;
  control: any;
  removeShift: (index: number) => void;
  watch: any;
}> = ({ index, field, control, removeShift, watch }) => {
  const isDefault = watch(`shifts.${index}.isDefault`);

  return (
    <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
      <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <Controller
          name={`shifts.${index}.isDefault`}
          control={control}
          render={({ field: radioField }) => (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="defaultShift" checked={radioField.value} onChange={() => radioField.onChange(true)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
              <Badge variant={radioField.value ? 'default' : 'outline'} size="sm">Default</Badge>
            </label>
          )}
        />
        <div className="flex-1 min-w-0">
          <Controller
            name={`shifts.${index}.name`}
            control={control}
            rules={{ required: 'Shift name is required' }}
            render={({ field: nameField }) => (
              <Input {...nameField} placeholder="Shift Name" className="font-medium bg-transparent border-none focus:ring-0 p-0 text-lg" />
            )}
          />
        </div>
        <Controller
          name={`shifts.${index}.color`}
          control={control}
          render={({ field: colorField }) => (
            <input type="color" value={colorField.value} onChange={(e) => colorField.onChange(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
          )}
        />
        <Button variant="ghost" size="icon" onClick={() => removeShift(index)}><Trash2 className="w-4 h-4" /></Button>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Controller
            name={`shifts.${index}.startTime`}
            control={control}
            rules={{ required: 'Start time is required' }}
            render={({ field: timeField }) => (
              <FormField label="Start Time" required error={timeField.error}>
                <Input {...timeField} type="time" />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.endTime`}
            control={control}
            rules={{ required: 'End time is required' }}
            render={({ field: timeField }) => (
              <FormField label="End Time" required error={timeField.error}>
                <Input {...timeField} type="time" />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.breakDurationMinutes`}
            control={control}
            rules={{ min: 0, max: 480 }}
            render={({ field: numField }) => (
              <FormField label="Break (Minutes)" error={numField.error}>
                <Input {...numField} type="number" min={0} max={480} step={5} />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.gracePeriodMinutes`}
            control={control}
            rules={{ min: 0, max: 120 }}
            render={({ field: numField }) => (
              <FormField label="Grace Period (Min)" error={numField.error}>
                <Input {...numField} type="number" min={0} max={120} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.lateThresholdMinutes`}
            control={control}
            rules={{ min: 0, max: 240 }}
            render={({ field: numField }) => (
              <FormField label="Late Threshold (Min)" error={numField.error}>
                <Input {...numField} type="number" min={0} max={240} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.earlyDepartureThresholdMinutes`}
            control={control}
            rules={{ min: 0, max: 240 }}
            render={({ field: numField }) => (
              <FormField label="Early Departure (Min)" error={numField.error}>
                <Input {...numField} type="number" min={0} max={240} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`shifts.${index}.daysApplicable`}
            control={control}
            render={({ field: daysField }) => (
              <DaysSelector value={daysField.value} onChange={daysField.onChange} error={daysField.error} />
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const GeofenceAccordionItem: React.FC<{
  index: number;
  field: any;
  control: any;
  removeGeofence: (index: number) => void;
}> = ({ index, field, control, removeGeofence }) => (
  <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
    <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
      <Controller
        name={`geofences.${index}.isActive`}
        control={control}
        render={({ field: activeField }) => (
          <Switch checked={activeField.value} onCheckedChange={activeField.onChange} />
        )}
      />
      <Controller
        name={`geofences.${index}.name`}
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field: nameField }) => (
          <Input {...nameField} placeholder="Geofence Name" className="font-medium bg-transparent border-none focus:ring-0 p-0 flex-1" />
        )}
      />
      <Button variant="ghost" size="icon" onClick={() => removeGeofence(index)}><Trash2 className="w-4 h-4" /></Button>
    </AccordionTrigger>
    <AccordionContent className="pb-4 pt-2">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Controller
          name={`geofences.${index}.latitude`}
          control={control}
          rules={{ required: 'Latitude is required', min: -90, max: 90 }}
          render={({ field: latField }) => (
            <FormField label="Latitude" required error={latField.error}>
              <Input {...latField} type="number" step="0.000001" placeholder="19.0760" />
            </FormField>
          )}
        />
        <Controller
          name={`geofences.${index}.longitude`}
          control={control}
          rules={{ required: 'Longitude is required', min: -180, max: 180 }}
          render={({ field: lngField }) => (
            <FormField label="Longitude" required error={lngField.error}>
              <Input {...lngField} type="number" step="0.000001" placeholder="72.8777" />
            </FormField>
          )}
        />
        <Controller
          name={`geofences.${index}.radiusMeters`}
          control={control}
          rules={{ required: 'Radius is required', min: 10, max: 5000 }}
          render={({ field: radiusField }) => (
            <FormField label="Radius (Meters)" required error={radiusField.error}>
              <Input {...radiusField} type="number" min={10} max={5000} step={10} />
            </FormField>
          )}
        />
        <Controller
          name={`geofences.${index}.address`}
          control={control}
          render={({ field: addrField }) => (
            <FormField label="Address (Optional)" error={addrField.error}>
              <Input {...addrField} placeholder="Office Address" />
            </FormField>
          )}
        />
      </div>
    </AccordionContent>
  </AccordionItem>
);

const IpAccordionItem: React.FC<{
  index: number;
  field: any;
  control: any;
  removeIp: (index: number) => void;
}> = ({ index, field, control, removeIp }) => (
  <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
    <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
      <Controller
        name={`ipRestrictions.${index}.isActive`}
        control={control}
        render={({ field: activeField }) => (
          <Switch checked={activeField.value} onCheckedChange={activeField.onChange} />
        )}
      />
      <Controller
        name={`ipRestrictions.${index}.name`}
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field: nameField }) => (
          <Input {...nameField} placeholder="IP Range Name" className="font-medium bg-transparent border-none focus:ring-0 p-0 flex-1" />
        )}
      />
      <Button variant="ghost" size="icon" onClick={() => removeIp(index)}><Trash2 className="w-4 h-4" /></Button>
    </AccordionTrigger>
    <AccordionContent className="pb-4 pt-2">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Controller
          name={`ipRestrictions.${index}.ipAddress`}
          control={control}
          rules={{ required: 'IP address is required' }}
          render={({ field: ipField }) => (
            <FormField label="IP Address / CIDR" required error={ipField.error} hint="e.g., 192.168.1.0/24 or 203.0.113.5">
              <Input {...ipField} placeholder="192.168.1.0/24" />
            </FormField>
          )}
        />
        <Controller
          name={`ipRestrictions.${index}.description`}
          control={control}
          render={({ field: descField }) => (
            <FormField label="Description" error={descField.error}>
              <Input {...descField} placeholder="Main Office Network" />
            </FormField>
          )}
        />
      </div>
    </AccordionContent>
  </AccordionItem>
);

export const AttendanceSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<AttendanceSettingsFormData>({
    resolver: zodResolver(updateAttendanceSettingsSchema),
    defaultValues: {
      shifts: [],
      geofences: [],
      ipRestrictions: [],
      defaultShiftId: '',
      allowMultipleCheckIns: false,
      requireGpsForCheckIn: false,
      requirePhotoForCheckIn: false,
      enableOfflineMode: true,
      autoCheckoutEnabled: false,
      autoCheckoutTime: '18:00',
      overtimeThresholdHours: 8,
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;
  const { fields: shiftFields, append: appendShift, remove: removeShift } = useFieldArray({ control, name: 'shifts' });
  const { fields: geofenceFields, append: appendGeofence, remove: removeGeofence } = useFieldArray({ control, name: 'geofences' });
  const { fields: ipFields, append: appendIp, remove: removeIp } = useFieldArray({ control, name: 'ipRestrictions' });

  // API hooks
  const { data: attendanceSettings, isLoading, error: fetchError, refetch } = useGetAttendanceSettingsQuery();
  const [updateAttendanceSettings] = useUpdateAttendanceSettingsMutation();

  useEffect(() => {
    if (attendanceSettings && !isLoading) {
      reset({
        shifts: attendanceSettings.shifts,
        geofences: attendanceSettings.geofences,
        ipRestrictions: attendanceSettings.ipRestrictions,
        defaultShiftId: attendanceSettings.defaultShiftId || '',
        allowMultipleCheckIns: attendanceSettings.allowMultipleCheckIns,
        requireGpsForCheckIn: attendanceSettings.requireGpsForCheckIn,
        requirePhotoForCheckIn: attendanceSettings.requirePhotoForCheckIn,
        enableOfflineMode: attendanceSettings.enableOfflineMode,
        autoCheckoutEnabled: attendanceSettings.autoCheckoutEnabled,
        autoCheckoutTime: attendanceSettings.autoCheckoutTime || '18:00',
        overtimeThresholdHours: attendanceSettings.overtimeThresholdHours,
      });
      markClean('attendance');
    }
  }, [attendanceSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('attendance');
    } else {
      markClean('attendance');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: AttendanceSettingsFormData) => {
    try {
      await updateAttendanceSettings(data).unwrap();
      markClean('attendance');
      success('Attendance settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update attendance settings', 'Save Failed');
    }
  }, [updateAttendanceSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (attendanceSettings) refetch();
  }, [attendanceSettings, refetch]);

  const addDefaultShift = useCallback(() => {
    const colors = SHIFT_COLORS;
    const nextColor = colors[shiftFields.length % colors.length];
    appendShift({
      name: `Shift ${shiftFields.length + 1}`,
      startTime: '09:00',
      endTime: '18:00',
      breakDurationMinutes: 60,
      gracePeriodMinutes: 15,
      lateThresholdMinutes: 30,
      earlyDepartureThresholdMinutes: 30,
      isDefault: shiftFields.length === 0,
      color: nextColor,
      daysApplicable: [1, 2, 3, 4, 5],
    });
  }, [shiftFields.length, appendShift]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Clock className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<MapPin className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Wifi className="w-5 h-5" />} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Failed to Load Settings</h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">{fetchError.message || 'Unable to connect to the settings service.'}</p>
        <Button variant="primary" onClick={() => refetch()}><RotateCcw className="w-4 h-4 mr-2" />Retry</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="shifts" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Clock className="w-4 h-4 mr-2 inline" />
            Shifts
          </TabsTrigger>
          <TabsTrigger value="geofences" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <MapPin className="w-4 h-4 mr-2 inline" />
            Geofences
          </TabsTrigger>
          <TabsTrigger value="ipRestrictions" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Wifi className="w-4 h-4 mr-2 inline" />
            IP Restrictions
          </TabsTrigger>
        </TabsList>

        {/* Shifts Tab */}
        <TabsContent value="shifts" className="space-y-6">
          <SectionCard
            title="Shift Timings"
            description="Configure work shifts with timings, breaks, and grace periods"
            icon={<Clock className="w-5 h-5 text-indigo-600" />}
          >
            {shiftFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No shifts configured yet</p>
                <Button variant="outline" onClick={addDefaultShift}><Plus className="w-4 h-4 mr-2" />Add First Shift</Button>
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {shiftFields.map((field, index) => (
                <ShiftAccordionItem
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  removeShift={removeShift}
                  watch={watch}
                />
              ))}
            </Accordion>

            <Button variant="outline" onClick={addDefaultShift} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Shift
            </Button>
          </SectionCard>

          <SectionCard
            title="General Attendance Rules"
            description="Configure global attendance policies"
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="defaultShiftId"
                control={control}
                render={({ field }) => (
                  <FormField label="Default Shift" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {shiftFields.map((s, i) => (
                          <SelectItem key={s.id} value={s.id}>{watch(`shifts.${i}.name`) || `Shift ${i + 1}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="overtimeThresholdHours"
                control={control}
                rules={{ min: 0, max: 24 }}
                render={({ field }) => (
                  <FormField label="Overtime Threshold (Hours)" error={field.error}>
                    <Input {...field} type="number" min={0} max={24} step={0.5} />
                  </FormField>
                )}
              />
              <Controller
                name="autoCheckoutTime"
                control={control}
                render={({ field }) => (
                  <FormField label="Auto Checkout Time" error={field.error}>
                    <Input {...field} type="time" />
                  </FormField>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {[
                { key: 'allowMultipleCheckIns', label: 'Allow Multiple Check-ins', description: 'Employees can check in/out multiple times per day' },
                { key: 'requireGpsForCheckIn', label: 'Require GPS for Check-in', description: 'Employees must share location when checking in' },
                { key: 'requirePhotoForCheckIn', label: 'Require Photo for Check-in', description: 'Employees must take a photo when checking in' },
                { key: 'enableOfflineMode', label: 'Enable Offline Mode', description: 'Allow check-ins when offline (syncs when online)' },
                { key: 'autoCheckoutEnabled', label: 'Enable Auto Checkout', description: 'Automatically check out employees at specified time' },
              ].map((rule) => (
                <Controller
                  key={rule.key}
                  name={rule.key}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{rule.label}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{rule.description}</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Geofences Tab */}
        <TabsContent value="geofences" className="space-y-6">
          <SectionCard
            title="Geofence Locations"
            description="Define allowed locations for check-ins using GPS coordinates"
            icon={<MapPin className="w-5 h-5 text-indigo-600" />}
          >
            {geofenceFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No geofences configured</p>
                <Button variant="outline" onClick={() => appendGeofence({ name: '', latitude: 0, longitude: 0, radiusMeters: 100, isActive: true })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Geofence
                </Button>
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {geofenceFields.map((field, index) => (
                <GeofenceAccordionItem
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  removeGeofence={removeGeofence}
                />
              ))}
            </Accordion>

            <Button variant="outline" onClick={() => appendGeofence({ name: '', latitude: 0, longitude: 0, radiusMeters: 100, isActive: true })} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Geofence
            </Button>
          </SectionCard>
        </TabsContent>

        {/* IP Restrictions Tab */}
        <TabsContent value="ipRestrictions" className="space-y-6">
          <SectionCard
            title="Allowed IP Addresses"
            description="Restrict check-ins to specific IP addresses or ranges"
            icon={<Wifi className="w-5 h-5 text-indigo-600" />}
          >
            {ipFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No IP restrictions configured</p>
                <Button variant="outline" onClick={() => appendIp({ name: '', ipAddress: '', isActive: true })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add IP Address
                </Button>
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {ipFields.map((field, index) => (
                <IpAccordionItem
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  removeIp={removeIp}
                />
              ))}
            </Accordion>

            <Button variant="outline" onClick={() => appendIp({ name: '', ipAddress: '', isActive: true })} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add IP Restriction
            </Button>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting || isSaving}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting || isSaving || !isValid} className="min-w-[140px]">
          {isSubmitting || isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {attendanceSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(attendanceSettings.updatedAt).toLocaleString()} by {attendanceSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default AttendanceSection;