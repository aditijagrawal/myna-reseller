import React, { useState, useRef, useEffect } from 'react';
import { FormInput, SingleSelect } from '../../../elemental-stubs';
import '../../../Molecules/Conditions/Conditions.css';
import styles from './DelayBody.module.css';

const font = '"Roboto", arial, sans-serif';

const DELAY_OPTIONS = [
  {
    value: 'set-time',
    label: 'For a set amount of time',
    example: 'Example : Delay for 5 days',
  },
  {
    value: 'calendar-date',
    label: 'Until a calendar date',
    example: 'Example: Delay until March 15, 2026',
  },
  {
    value: 'date-property',
    label: 'Until a date property',
    example: "Example: Delay until contact's last activity",
  },
  {
    value: 'day-of-week',
    label: 'Until a date of the week',
    example: 'Example: Delay until tuesday',
  },
  {
    value: 'time-of-day',
    label: 'Until a specific time of the day',
    example: 'Example: Delay until 5:00 PM IST',
  },
];

const TIME_UNIT_OPTIONS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'seconds', label: 'Seconds' },
];

const DAY_OF_WEEK_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const DATE_PROPERTY_OPTIONS = [
  { value: 'last_activity', label: "Contact's last activity" },
  { value: 'created_at', label: 'Contact created date' },
  { value: 'appointment_date', label: 'Appointment date' },
  { value: 'follow_up_date', label: 'Follow-up date' },
];

function FieldLabel({ label, required }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '18px',
        letterSpacing: '-0.24px',
        color: '#212121',
        fontFamily: font,
      }}>
        {label}
      </span>
      {required && (
        <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>
      )}
    </div>
  );
}

function DelayOptionDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = DELAY_OPTIONS.find((o) => o.value === value);

  return (
    <div className="tc-dropdown" ref={ref}>
      <button
        type="button"
        className={`tc-dropdown__trigger${open ? ' tc-dropdown__trigger--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`tc-dropdown__value${!selected ? ' tc-dropdown__value--placeholder' : ''}`}>
          {selected ? selected.label : 'Select delay option'}
        </span>
        <span className="material-symbols-outlined tc-dropdown__chevron">expand_more</span>
      </button>

      {open && (
        <div className={`tc-dropdown__menu ${styles.delayMenu}`} role="listbox">
          <div className={styles.delayMenuHeader}>Select delay options</div>
          {DELAY_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`tc-dropdown__option ${styles.delayOption}${isSelected ? ' tc-dropdown__option--selected' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <div className={styles.delayOptionText}>
                  <div className={styles.delayOptionLabel}>{opt.label}</div>
                  <div className={styles.delayOptionExample}>{opt.example}</div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined tc-dropdown__check">check</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DelayBody({ initialValues = {}, onFieldChange, viewOnly = false }) {
  const [delayOption, setDelayOption] = useState(initialValues.delayOption ?? 'set-time');
  const [timeUnit, setTimeUnit] = useState(initialValues.unit ?? 'days');
  const [unitValue, setUnitValue] = useState(initialValues.duration ?? '');
  const [calendarDate, setCalendarDate] = useState(initialValues.calendarDate ?? '');
  const [dateProperty, setDateProperty] = useState(initialValues.dateProperty ?? '');
  const [dayOfWeek, setDayOfWeek] = useState(initialValues.dayOfWeek ?? '');
  const [timeOfDay, setTimeOfDay] = useState(initialValues.timeOfDay ?? '');

  const handleDelayOptionChange = (val) => {
    setDelayOption(val);
    onFieldChange?.('delayOption', val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Delay options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FieldLabel label="Delay options" required />
        <DelayOptionDropdown
          value={delayOption}
          onChange={handleDelayOptionChange}
        />
      </div>

      {/* Conditional fields */}
      {delayOption === 'set-time' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FieldLabel label="Time unit" required />
            <SingleSelect
              name="timeUnit"
              selected={timeUnit}
              options={TIME_UNIT_OPTIONS}
              onChange={(opt) => { setTimeUnit(opt.value); onFieldChange?.('unit', opt.value); }}
              placeholder="Select unit"
              disabled={viewOnly}
            />
          </div>

          <FormInput
            name="unitValue"
            type="number"
            label="Unit value"
            placeholder="Enter value"
            value={unitValue}
            onChange={(e) => { setUnitValue(e.target.value); onFieldChange?.('duration', e.target.value); }}
            required
            min={1}
            disabled={viewOnly}
          />
        </>
      )}

      {delayOption === 'calendar-date' && (
        <FormInput
          name="calendarDate"
          type="date"
          label="Calendar date"
          value={calendarDate}
          onChange={(e) => { setCalendarDate(e.target.value); onFieldChange?.('calendarDate', e.target.value); }}
          required
          disabled={viewOnly}
        />
      )}

      {delayOption === 'date-property' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <FieldLabel label="Date property" required />
          <SingleSelect
            name="dateProperty"
            selected={dateProperty}
            options={DATE_PROPERTY_OPTIONS}
            onChange={(opt) => { setDateProperty(opt.value); onFieldChange?.('dateProperty', opt.value); }}
            placeholder="Select property"
            disabled={viewOnly}
          />
        </div>
      )}

      {delayOption === 'day-of-week' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <FieldLabel label="Day of the week" required />
          <SingleSelect
            name="dayOfWeek"
            selected={dayOfWeek}
            options={DAY_OF_WEEK_OPTIONS}
            onChange={(opt) => { setDayOfWeek(opt.value); onFieldChange?.('dayOfWeek', opt.value); }}
            placeholder="Select day"
            disabled={viewOnly}
          />
        </div>
      )}

      {delayOption === 'time-of-day' && (
        <FormInput
          name="timeOfDay"
          type="time"
          label="Time of day"
          value={timeOfDay}
          onChange={(e) => { setTimeOfDay(e.target.value); onFieldChange?.('timeOfDay', e.target.value); }}
          required
          disabled={viewOnly}
        />
      )}
    </div>
  );
}
