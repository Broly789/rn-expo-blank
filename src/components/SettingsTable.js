import React from 'react'
import { TableView, Section } from 'clwy-react-native-tableview-simple'
import SettingsCell from './SettingsCell'

export default function SettingsTable({ sections = [] }) {
  return (
    <TableView>
      {sections.map((sec, si) => (
        <Section
          key={si}
          hideSurroundingSeparators={sec.hideSurroundingSeparators ?? true}
          roundedCorners={sec.roundedCorners ?? true}
          sectionPaddingTop={sec.sectionPaddingTop ?? 20}
          separatorInsetRight={sec.separatorInsetRight ?? '18'}
          separatorTintColor={sec.separatorTintColor ?? '#ddd'}
        >
          {sec.cells.map((cell, ci) => (
            <SettingsCell key={ci} {...cell} />
          ))}
        </Section>
      ))}
    </TableView>
  )
}
