import { useState, useCallback, type FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import { updateSalary } from '../api/api';
import type { UpdateSalaryPayload } from '../api/api';
import {
  StyledDialogTitle,
  StyledDialogContent,
  StyledDialogActions,
  FormRow,
  EmployeeNameChip,
} from './SalaryUpdateDialog.styles';

interface SalaryUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeId: string;
  employeeName: string;
  currency: string;
  currentBaseSalary: number;
  currentBonus: number;
}

interface FormErrors {
  baseSalary?: string;
  bonus?: string;
  effectiveDate?: string;
  reason?: string;
}

const SalaryUpdateDialog: FC<SalaryUpdateDialogProps> = ({
  open,
  onClose,
  onSuccess,
  employeeId,
  employeeName,
  currency,
  currentBaseSalary,
  currentBonus,
}) => {
  const queryClient = useQueryClient();

  const [baseSalary, setBaseSalary] = useState(String(currentBaseSalary));
  const [bonus, setBonus] = useState(String(currentBonus));
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const resetForm = useCallback(() => {
    setBaseSalary(String(currentBaseSalary));
    setBonus(String(currentBonus));
    setEffectiveDate('');
    setReason('');
    setErrors({});
    setApiError('');
  }, [currentBaseSalary, currentBonus]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const baseSalaryNum = Number(baseSalary);
    if (baseSalary === '' || isNaN(baseSalaryNum)) {
      newErrors.baseSalary = 'Base salary is required';
    } else if (baseSalaryNum < 0) {
      newErrors.baseSalary = 'Base salary must be non-negative';
    }

    const bonusNum = Number(bonus);
    if (bonus === '' || isNaN(bonusNum)) {
      newErrors.bonus = 'Bonus is required';
    } else if (bonusNum < 0) {
      newErrors.bonus = 'Bonus must be non-negative';
    }

    if (!effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: (payload: UpdateSalaryPayload) => updateSalary(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employeeSalaryHistory', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['overviewAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      resetForm();
      onSuccess();
      onClose();
    },
    onError: (err: Error) => {
      setApiError(err.message);
    },
  });

  const handleSubmit = () => {
    setApiError('');
    if (!validate()) return;

    mutation.mutate({
      baseSalary: Number(baseSalary),
      bonus: Number(bonus),
      effectiveDate,
      reason: reason.trim(),
    });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      data-testid="salary-update-dialog"
    >
      <StyledDialogTitle>
        <EditRoundedIcon color="primary" />
        Update Salary
      </StyledDialogTitle>

      <StyledDialogContent>
        <EmployeeNameChip>
          <PersonRoundedIcon sx={{ fontSize: '1rem' }} />
          {employeeName}
        </EmployeeNameChip>

        {apiError && (
          <Alert severity="error" data-testid="salary-update-error">
            {apiError}
          </Alert>
        )}

        <FormRow>
          <TextField
            label="Base Salary"
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            error={!!errors.baseSalary}
            helperText={errors.baseSalary}
            fullWidth
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              },
              htmlInput: { min: 0, 'data-testid': 'base-salary-input' },
            }}
          />
          <TextField
            label="Bonus"
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            error={!!errors.bonus}
            helperText={errors.bonus}
            fullWidth
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              },
              htmlInput: { min: 0, 'data-testid': 'bonus-input' },
            }}
          />
        </FormRow>

        <TextField
          label="Effective Date"
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          error={!!errors.effectiveDate}
          helperText={errors.effectiveDate}
          fullWidth
          required
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { 'data-testid': 'effective-date-input' },
          }}
        />

        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={!!errors.reason}
          helperText={errors.reason}
          fullWidth
          required
          multiline
          rows={2}
          placeholder="e.g., Annual performance review, Promotion"
          slotProps={{
            htmlInput: { 'data-testid': 'reason-input' },
          }}
        />
      </StyledDialogContent>

      <StyledDialogActions>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="inherit"
          data-testid="salary-update-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending}
          data-testid="salary-update-submit"
          startIcon={mutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {mutation.isPending ? 'Saving...' : 'Update Salary'}
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default SalaryUpdateDialog;
