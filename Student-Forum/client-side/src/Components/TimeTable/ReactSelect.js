import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { TimeTableContext } from './TimeTableContext';
import apiClient from '../../api/apiClient';
import { saceitSemesters, saceitSpecialties } from '../../data/saceit';

const timetableGroupsByDepartment = {
  'Інженерія програмного забезпечення': ['43-П', '44-П', '46-П'],
  'Менеджмент': ['18м'],
  'Торгівля (Комерційна діяльність та логістика)': ['12к', '22к', '29к', '32к'],
  'Туризм та рекреація': ['11т', '21т', '28т', '31т', '38т'],
  'Готельно-ресторанна справа та кейтеринг': ['17гр', '27гр', '37гр', '310гр'],
  'Кібербезпека та захист інформації': ['1', '2'],
  'Автоматизація, комп\'ютерно-інтегровані технології та робототехніка': ['1', '2'],
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect() {
  const [, setTimeTableData] = useContext(TimeTableContext);

  const classes = useStyles();
  const [department, setDepartment] = React.useState('');
  const [section, setSection] = React.useState('');
  const [semester, setSemester] = React.useState('');

  const handleChange1 = (event) => {
    setDepartment(event.target.value);
  };

  const handleChange2 = (event) => {
    setSection(event.target.value);
  };

  const handleChange3 = (event) => {
    setSemester(event.target.value);
  };

  const availableGroups = timetableGroupsByDepartment[department] || ['A', 'B', 'C'];

  const showTimetable = async (e) => {
    e.preventDefault();

    const Data = {
      department: department,
      section: section,
      semester: semester,
    };

    try {
      const response = await apiClient.post('/timetable', Data);

      if (response.status === 200 && response.data.data.length !== 0) {
        setTimeTableData(response.data.data);
      } else {
        window.alert('Error 404: Data not found');
      }
    } catch (err) {
      window.alert('Error 500: Server error');
    }
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="department">Department</InputLabel>
        <Select
          labelId="department"
          id="department"
          value={department}
          onChange={handleChange1}
          label="Department"
        >
          <MenuItem value="">
            <em>-</em>
          </MenuItem>
          {saceitSpecialties.map((specialty) => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="section">Group</InputLabel>
        <Select
          labelId="section"
          id="section"
          value={section}
          onChange={handleChange2}
          label="Group"
        >
          <MenuItem value="">
            <em>-</em>
          </MenuItem>
          {availableGroups.map((groupCode) => (
            <MenuItem key={groupCode} value={groupCode}>
              {groupCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="semester">Semester</InputLabel>
        <Select
          labelId="semester"
          id="semester"
          value={semester}
          onChange={handleChange3}
          label="Semester"
        >
          <MenuItem value="">
            <em>-</em>
          </MenuItem>
          {saceitSemesters.map((semesterValue) => (
            <MenuItem key={semesterValue} value={semesterValue}>
              {semesterValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" onClick={showTimetable} className="timetable__page__button">
        Show Timetable
      </Button>
    </>
  );
}
